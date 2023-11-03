'use strict';
const authToken = require('../common/jwt.auth');
const crypto = require('../common/crypto');
let cryptoModule = require('crypto');
const moment = require('moment');
const { executeQuery } = require('../db/mysql_connection');

class CommonUtility {
    constructor(payload) {
        this.payload = payload;
    }


    async generateAuthToken(user_details) {
        let jwt_token = await authToken.encrypt({
            user_id: user_details.user_id,
            email: user_details.email,
            role_id: user_details.role_id
        });
        return crypto.encrypt(jwt_token);
    }

    async getUserByEmail(email) {
        try {
            const query = 'SELECT user_id, email, password, status, role_id FROM Users WHERE email = ?';
            const [results] = await executeQuery(query, [email]);
            return results[0];
        } catch (error) {
            throw new CustomError()
        }
    }

    async getDefaultAdmin() {
        try {
            const query = 'SELECT user_id FROM Users WHERE role_id = 1';
            const [results] = await executeQuery(query);
            return results[0];
        } catch (error) {
            throw new CustomError()
        }
    }

    async addUser(data) {
        try {
            const { email, password, first_name, last_name, role_id, manager_id, uuid} = data;
            let res = await this.getUserByUserId(manager_id);
            if (res?.role_id != 3) {
                const query = 'INSERT INTO Users (email, password,  first_name, last_name, role_id, manager_id, status, approval_token) VALUES (?, ?, ?, ?, ?, ? , ?, ?)';
                const [results] = await executeQuery(query, [email, password,  first_name, last_name, role_id, manager_id, "pending", uuid]);
                return results;
            }else {
                throw "Manager ID not valid, please try again";
            }
        } catch (error) {
            if (error?.code == 'ER_DUP_ENTRY') {
                throw new CustomError("Email already registerd with us.", 500, "addUser");
            }
            throw new CustomError(error, 500, "addUser");
        }
    }

    async getUsers() {
        try {
            const query = 'SELECT user_id, email, first_name, status, role_id, manager_id FROM Users where role_id != 1';
            const [results] = await executeQuery(query);
            return results;
        } catch (error) {
            throw new CustomError(error, 500, "getUsers");
        }
    }

    async getUserByUserId(user_id) {
        try {
            const query = 'SELECT user_id, email,  first_name,status, manager_id,role_id FROM Users WHERE user_id = ?';
            const [results] = await executeQuery(query, [user_id]);
            return results[0];
        } catch (error) {
            throw new CustomError(error, 500, "getUserByEmail");
        }
    }

    async getUserAttendanceByUserId(user_id, from_date, to_date) {
        try {
            const query = 'SELECT * FROM Attendance WHERE user_id = ? and date BETWEEN ? and ?';
            const [results] = await executeQuery(query, [user_id, from_date, to_date]);
            return results;
        } catch (error) {
            throw new CustomError(error, 500, "getUserAttendanceByUserId");
        }
    }

    async getUserAttendanceById(id) {
        try {
            const query = 'SELECT status FROM Attendance WHERE attendance_id = ?';
            const [results] = await executeQuery(query, [id]);
            return results[0];
        } catch (error) {
            throw new CustomError(error, 500, "getUserAttendanceByUserId");
        }
    }

    async addUserAttendance(data) {
        try {
            const res = await this.checkUserHasManager(data.user_id);
            if (res) {
                const status = 'Pending';
                const query = 'INSERT INTO Attendance (user_id, date, status, total_hours, approval_token) VALUES (?, ?,  ?, ?, ?)';
                const [results] = await executeQuery(query, [data.user_id, data.date, status, data.logged_hours, data.uuid]);
                return `Attendance record added for ${moment(data.date).format('YYYY-MM-DD')}.`;
            } else {
                throw "Manager not assigned to you, Please send request for manager assignment.";
            }

        } catch (error) {
            if (error?.code == 'ER_DUP_ENTRY') {
                return `Attendance record alredy exists for ${moment(data.date).format('YYYY-MM-DD')}.`
            }
            throw new CustomError(error, 500, "addUserAttendance");
        }
    }
    //Manager Requests
    async getManagerRequest(user_id) {
        try {
            const query = 'SELECT * from manager_request where manager_id = ?';
            const [results] = await executeQuery(query, [user_id]);
            return results;
        } catch (error) {
            throw new CustomError(error, 500, "getManagerRequest");
        }
    }

    async getAllManagerRequest() {
        try {
            const query = 'SELECT * from manager_request';
            const [results] = await executeQuery(query);
            return results;
        } catch (error) {
            throw new CustomError(error, 500, "getManagerRequest");
        }
    }

    async getManagerRequestByStatus(user_id, manager_id, status) {
        try {
            const query = 'SELECT count(1) as total from manager_request where user_id = ? and manager_id = ? and status = ?';
            const [results] = await executeQuery(query, [user_id, manager_id, status]);
            return results[0];
        } catch (error) {
            throw new CustomError(error, 500, "getManagerRequestByStatus");
        }
    }

    async getUserByManagerRequestId(id) {
        try {
            const query = 'SELECT first_name, email from Users WHERE user_id = (SELECT user_id FROM manager_request WHERE id = ? )';
            const [results] = await executeQuery(query, [id]);
            return results[0];
        } catch (error) {
            throw new CustomError(error, 500, "getUserByManagerRequestId");
        }
    }

    async managerRequestStatus(id) {
        try {
            const query = 'SELECT status from manager_request where id = ?';
            const [results] = await executeQuery(query, [id]);
            return results[0];
        } catch (error) {
            throw new CustomError(error, 500, "managerRequestStatus");
        }
    }

    async checkManagerRequestById(id) {
        try {
            const query = 'SELECT manager_id from manager_request where id = ? ';
            const [results] = await executeQuery(query, [id]);
            if (results[0]?.manager_id !== this.payload.user_id) {
                return false;
            }
            return true;
        } catch (error) {
            throw new CustomError(error, 500, "checkManagerRequestById");
        }
    }

    async checkUserManagerById(id) {
        try {
            const query = 'SELECT manager_id from users where user_id = ? ';
            const [results] = await executeQuery(query, [id]);
            if (results[0]?.manager_id !== this.payload.user_id) {
                return false;
            }
            return true;
        } catch (error) {
            throw new CustomError(error, 500, "checkUserManagerById");
        }
    }

    async addManagerRequest(user_id, manager_id) {
        try {
            let res = await this.getUserByUserId(manager_id);
            if (res?.role_id != 3) {
                const requestCount = await this.getManagerRequestByStatus(user_id, manager_id, 'Pending');
                if (requestCount?.total == 0) {
                    const query = 'INSERT INTO manager_request (user_id, manager_id) VALUES (?, ?)';
                    await executeQuery(query, [user_id, manager_id]);
                    return `Manager request submitted for approval.`;
                } else {
                    throw `Manager request already submitted for approval.`;
                }

            } else {
                throw `Please send valid manager ID.`;
            }

        } catch (error) {
            throw new CustomError(error, 500, "addUserAttendance");
        }
    }

    async updateUserStatus(id, manager_id, status){
        try {
            const res = this.payload.role_id === 1 ? true : await this.checkUserManagerById(id);
            if (res) {
                const query = 'UPDATE users SET status = ?, approval_id = ? WHERE user_id = ?';
                const [results] = await executeQuery(query, [status, manager_id, id]);
                return results?.changedRows;
            } else {
                return 401;
                //return `Not Authorized to update manager request with ID ${id}.`
            } 
        } catch (error) {
            throw new CustomError(error, 500, "updateUserStatus");
        }
    }

    async updateManagerRequest(id, manager_id, status){
        try {
            const res = this.payload.role_id === 1 ? true : await this.checkManagerRequestById(id);
            if (res) {
                const request_status = await this.managerRequestStatus(id);
                if (request_status?.status == 'Pending') {
                    const query = 'UPDATE manager_request SET status = ?, approval_date = NOW() WHERE id = ?';
                    const [results] = await executeQuery(query, [status, id]);
                    if (results?.changedRows > 0) {
                        status == 'Approved' ? this.updateMangerId(id, manager_id) : null;
                        return results?.changedRows;
                    }
                    return results?.changedRows;
                }else {
                    return request_status.status;
                    //return `Manager request with with ID ${id} already ${request_status.status}.`
                }
                
            } else {
                return 401;
                //return `Not Authorized to update manager request with ID ${id}.`
            } 
        } catch (error) {
            throw new CustomError(error, 500, "addUserAttendance");
        }
    }

    async updateMangerId(id, manager_id){
        try {
            const query = 'UPDATE Users SET manager_id = ? WHERE user_id = (SELECT user_id from manager_request where id = ?)';
            const [results] = await executeQuery(query, [manager_id, id]);
            return results;
        } catch (error) {
            throw new CustomError(error, 500, "updateMangerId");
        }
    }

    async updateDefaultMangerId(id, manager_id){
        try {
            const query = 'UPDATE Users SET manager_id = ? WHERE user_id = ?';
            const [results] = await executeQuery(query, [manager_id, id]);
            return results;
        } catch (error) {
            throw new CustomError(error, 500, "updateMangerId");
        }
    }

    async getManagerUsers() {
        try {
            const query = `SELECT user_id, email, first_name, status, role_id, manager_id FROM Users where role_id != 3 and user_id != ${this.payload.user_id}`;
            const [results] = await executeQuery(query);
            return results;
        } catch (error) {
            throw new CustomError(error, 500, "getManagerUsers");
        }
    }

    async getManagerUsersPublic() {
        try {
            const query = `SELECT user_id, first_name, last_name FROM Users where role_id = 2`;
            const [results] = await executeQuery(query);
            return results;
        } catch (error) {
            throw new CustomError(error, 500, "getManagerUsersPublic");
        }
    }

    async getUsersByManager(user_id) {
        try {
            const query = 'SELECT user_id, email, first_name, status, role_id, manager_id FROM Users where manager_id = ?';
            const [results] = await executeQuery(query, [user_id]);
            return results;
        } catch (error) {
            throw new CustomError(error, 500, "getUsersByManager");
        }
    }

    async getUsersByAttendanceId(attendance_id) {
        try {
            const query = 'SELECT email, first_name FROM Users where user_id = (SELECT user_id from attendance WHERE attendance_id = ?)';
            const [results] = await executeQuery(query, [attendance_id]);
            return results[0];
        } catch (error) {
            throw new CustomError(error, 500, "getUsersByManager");
        }
    }

    async attendanceRecordsByManager(user_id, status = null) {
        try {
            let filter = '';
            if(status){
                filter = ` and a.status = "${status}" `;
            }
            const query = `SELECT a.*, u.first_name FROM Attendance a JOIN Users u ON a.user_id = u.user_id and u.manager_id = ? ${filter}`;
            const [results] = await executeQuery(query, [user_id]);
            return results;
        } catch (error) {
            throw new CustomError(error, 500, "attendanceRecordsByManager");
        }
    }

    async allAttendanceRecords(status = null) {
        try {
            let filter = '';
            if(status){
                filter = ` and a.status = "${status}" `;
            }

            const query = `SELECT a.*, u.first_name FROM Attendance a JOIN Users u ON a.user_id = u.user_id ${filter}`
            const [results] = await executeQuery(query);
            return results;
        } catch (error) {
            throw new CustomError(error, 500, "attendanceRecordsByManager");
        }
    }

    async updateattendanceRecords(id, status) {
        try {
            const res = this.payload.role_id === 1 ? true : await this.checkUserBelongsToManager(id);
            if (res) {
                const attendance_status = await this.getUserAttendanceById(id);
                if (attendance_status?.status == 'Pending') {
                    const query = 'UPDATE Attendance SET status = ? WHERE attendance_id = ?';
                    const [results] = await executeQuery(query, [status, id]);
                    return results?.changedRows;
                } else {
                    return attendance_status?.status;
                }
                
            } else {
                return 401;
            }
        } catch (error) {
            throw new CustomError(error, 500, "updateUserRoles");
        }
    }

    async checkUserBelongsToManager(attendance_id) {
        try {

            const query = 'SELECT manager_id FROM Users WHERE user_id = (SELECT user_id from Attendance where attendance_id = ?)';
            const [results] = await executeQuery(query, [attendance_id]);

            if (results[0].manager_id !== this.payload.user_id) {
                return false;
            }
            return true;
        } catch (error) {
            return error;
        }
    }

    async checkUserHasManager(user_id) {
        try {

            const query = 'SELECT manager_id FROM Users WHERE user_id = ?';
            const [results] = await executeQuery(query, [user_id]);

            if (!results[0]?.manager_id) {
                return false;
            }
            return true;
        } catch (error) {
            return error;
        }
    }

    async getManagerEmail(user_id) {
        try {

            const query = 'SELECT m.email as manager_email, m.first_name as manager_name, u.first_name as user_name from Users as u LEFT JOIN Users as m ON u.manager_id = m.user_id WHERE u.user_id = ?';
            const [results] = await executeQuery(query, [user_id]);

            return results[0];
        } catch (error) {
            return error;
        }
    }

    async getUserIdsByAttendanceID(attendance_ids) {
        try {
            const query = 'SELECT user_id FROM Attendance where manager_id = ?'
            const [results] = await executeQuery(query, [user_id]);
            return results;
        } catch (error) {
            throw new CustomError(error, 500, "attendanceRecordsByManager");
        }
    }

    async getUserIdsBelongstoManager(user_id) {
        try {
            const query = 'SELECT user_id FROM Users where manager_id = ?'
            const [results] = await executeQuery(query, [user_id]);
            return results;
        } catch (error) {
            throw new CustomError(error, 500, "attendanceRecordsByManager");
        }
    }

    async updateUserRoles(role, user_ids) {
        try {
            const query = 'UPDATE Users SET role_id = ? WHERE user_id in (?)';
            const [results] = await executeQuery(query, [role, user_ids]);
            return results;
        } catch (error) {
            throw new CustomError(error, 500, "updateUserRoles");
        }
    }

    async crypt(salt, text) {
        const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
        const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
        const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

        return text
            .split("")
            .map(textToChars)
            .map(applySaltToChar)
            .map(byteHex)
            .join("");
    };

    //Approve/ Reject By Token

    async appoveUserByToken(data){
        try {
            let count_query = 'SELECT count(1) as total from Users where approval_token = ?';
            const [count] = await executeQuery(count_query, [data.token]);
            if(count[0]?.total){
                const query = 'UPDATE Users SET status = ?, approval_token = null  WHERE approval_token = ?';
                const [results] = await executeQuery(query, [data.status, data.token]);
                return results;
            } else {
                throw "Invalid Token";
            }
        } catch (error) {
            throw new CustomError(error, 500, "appoveUserByToken");
        }
    }

    async approveAttendanceByToken(data){
        try {
            let count_query = 'SELECT count(1) as total from Attendance where approval_token = ?';
            const [count] = await executeQuery(count_query, [data.token]);
            if(count[0]?.total){
                const query = 'UPDATE Attendance SET status = ?, approval_token = null  WHERE approval_token = ?';
                const [results] = await executeQuery(query, [data.status, data.token]);
                return results;
            } else {
                throw "Invalid Token";
            }
        } catch (error) {
            throw new CustomError(error, 500, "appoveAttendanceByToken");
        }
    }

    async decrypt(salt, encoded) {
        const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
        const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

        return encoded
            .match(/.{1,2}/g)
            .map((hex) => parseInt(hex, 16))
            .map(applySaltToChar)
            .map((charCode) => String.fromCharCode(charCode))
            .join("");
    };

    async intercomHash(data, secret_key) {
        return await cryptoModule
            .createHmac('sha256', secret_key)
            .update(data)
            .digest('hex')
    }

}

module.exports = CommonUtility;
