const BaseSchemaValidator = require('../../common/schema_validator');
const userSchema = require('../../models/user_schema');
const CommonUtility = require('../../utilities/common_utility');
const { approveAttendanceNotification, approveManagerRequestNotification, approveRegistrationNotification} = require('../../common/mail_template');

class Manager {
    constructor(param, payload, file = null) {
        this.param = param;
        this.payload = payload;
        this.schemaValidator = new BaseSchemaValidator();
    }

    async getUsersByManager() {
        try {
            const commonUtility = new CommonUtility();
            let users = await commonUtility.getUsersByManager(this.payload.user_id);
            return users;
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "getUsersByManager");
        }
    }

    async attendanceRecordsByManager() {
        try {
            let status = null;
            if(this.param?.status){
                status = this.param.status;
                const validStatus = ['Approved', 'Pending', 'Rejected'];
                if(!validStatus.includes(status)){
                    throw 'Please provide valid status like Approved, Pending, Rejected'
                }

            }
            const commonUtility = new CommonUtility();
            let users = await commonUtility.attendanceRecordsByManager(this.payload.user_id, status);
            return users;
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "attendanceRecordsByManager");
        }
    }

    async updateAttendanceDetails() {
        try {
            const validatedPayload = await this.schemaValidator.validateSchema(this.payload, userSchema.updateAttendanceSchema());
            const { attendance_ids, status } = validatedPayload;
            const commonUtility = new CommonUtility(this.payload);
            let result = [];
            for(let i = 0; i < attendance_ids.length; i++){
                const res = await commonUtility.updateattendanceRecords(attendance_ids[i], status);
                if(res > 0){
                    result.push(`Attendace request with ID ${attendance_ids[i]} ${status}.`);
                    approveAttendanceNotification(attendance_ids[i], status);
                } else if (res == 0) {
                    result.push(`Attendace request with ID ${attendance_ids[i]} already ${status}.`);
                } else if (res == 401){
                    result.push(`Not authorized to update attendace request ${attendance_ids[i]}.`);
                } else {
                    result.push(`Attendace request with ID ${attendance_ids[i]} already ${res}.`);
                }
            }
            return result;
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "updateAttendanceDetails");
        }
    }

    //Manager Requests
    async getManagerRequests() {
        try {
            const commonUtility = new CommonUtility();
            let users = await commonUtility.getManagerRequest(this.payload.user_id);
            return users;
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "getManagerRequests");
        }
    }

    async updateManagerRequest() {
        try {
            const validatedPayload = await this.schemaValidator.validateSchema(this.param, userSchema.updateManagerRequest());
            const commonUtility = new CommonUtility(this.payload);
            const { id, status } = validatedPayload;
            let res = await commonUtility.updateManagerRequest(id, this.payload.user_id, status);
            let result;
            if(res > 0){
                result = `Manager assignment request with ID ${id} ${status}.`;
                approveManagerRequestNotification(id, status);
            } else if (res == 0) {
                result = `Manager assignment request with ID ${id} already ${status}.`;
            } else if (res == 401){
                result = `Not authorized to update Manager assignment request with ID ${id}.`;
            } else {
                result = `Manager assignment request with ID ${id} already ${res}.`;
            }

            
            return result;
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "updateManagerRequest");
        }
    }

    async updateUserStatus() {
        try {
            const validatedPayload = await this.schemaValidator.validateSchema(this.param, userSchema.updateUserStatus());
            const commonUtility = new CommonUtility(this.payload);
            const { id, status } = validatedPayload;
            let res = await commonUtility.updateUserStatus(id, this.payload.user_id, status);
            let result;
            if(res > 0){
                result = `User with id ${id} ${status}.`;
                approveRegistrationNotification(id, status);
            } else if (res == 0) {
                result = `Account already ${status}.`;
            } else if (res == 401){
                result = `Not authorized to update this user.`;
            } else {
                result =  `Account already ${status}.`;
            }

            
            return result;
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "updateUserStatus");
        }
    }

}
module.exports = Manager;