const BaseSchemaValidator = require('../../common/schema_validator');
const adminSchema = require('../../models/admin_schema');
const bcrypt = require("bcrypt");
const {SALT_ROUND} = require('../../environment');
const { executeQuery } = require('../../db/mysql_connection');
const CommonUtility = require('../../utilities/common_utility');

class Admin {
    constructor(param, payload, file = null) {
        this.param = param;
        this.payload = payload;
        this.schemaValidator = new BaseSchemaValidator();
    }

    async getUsers() {
        try {
            const commonUtility = new CommonUtility();
            let users = await commonUtility.getUsers();
            return users;
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "getUsers");
        }
    }

    async getManagerUsers() {
        try {
            const commonUtility = new CommonUtility(this.payload);
            let users = await commonUtility.getManagerUsers();
            return users;
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "getManagerUsers");
        }
    }

    async getUsersByManager() {
        try {
            const validatedPayload = await this.schemaValidator.validateSchema(this.param, adminSchema.manager());

            const commonUtility = new CommonUtility();
            let users = await commonUtility.getUsersByManager(validatedPayload.manager_id);
            return users;
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "getUsersByManager");
        }
    }

    async changeUserRole() {
        try {
            const validatedPayload = await this.schemaValidator.validateSchema(this.payload, adminSchema.changeUserRole());
            const { role, user_ids } = validatedPayload;
            const commonUtility = new CommonUtility();
            let users = await commonUtility.updateUserRoles(role, user_ids);
            return users?.changedRows > 0 ? {
                message: "User Role changed successfully."
            } : {
                message: "Selected Role already assigned to this users."
            };
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "changeUserRole");
        }
    }

    async allattendanceRecords() {
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
            let users = await commonUtility.allAttendanceRecords(status);
            return users;
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "allattendanceRecords");
        }
    }

    //Manager Requests
    async getManagerRequests() {
        try {
            const commonUtility = new CommonUtility();
            let users = await commonUtility.getAllManagerRequest(this.payload.user_id);
            return users;
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "getManagerRequests");
        }
    }

}
module.exports = Admin;