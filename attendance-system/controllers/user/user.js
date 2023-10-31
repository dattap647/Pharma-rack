const BaseSchemaValidator = require('../../common/schema_validator');
const CommonUtility = require('../../utilities/common_utility');
const userSchema = require('../../models/user_schema');
const { addAttendanceNotification, sendManagerAssignmentRequestNotification} = require('../../common/mail_template');

class User {
    constructor(param, payload, file = null) {
        this.param = param;
        this.payload = payload;
        this.schemaValidator = new BaseSchemaValidator();
    }

    async getUsers() {
        try {
            const commonUtility = new CommonUtility();
            let users = await commonUtility.getUserByUserId(this.payload.user_id);
            return users;
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "getUsers");
        }
    }

    async getAttendanceDetails() {
        try {
            const validatedPayload = await this.schemaValidator.validateSchema(this.param, userSchema.getAttendanceSchema());
            const { from_date, to_date} = validatedPayload;
            const commonUtility = new CommonUtility();
            let users = await commonUtility.getUserAttendanceByUserId(this.payload.user_id, from_date, to_date);
            return users;
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "getUsers");
        }
    }

    async addAttendanceDetails() {
        try {
            
            const validatedPayload = await this.schemaValidator.validateSchema(this.payload, userSchema.addAttendanceSchema());
            const { dates, logged_hours} = validatedPayload;
            const result = []
            for (let i = 0; i < dates.length; i++){
                const data = {
                    user_id : this.payload.user_id,
                    date : dates[i],
                    logged_hours : logged_hours
                }
                const commonUtility = new CommonUtility();
                result.push(await commonUtility.addUserAttendance(data));
            }
            addAttendanceNotification(this.payload.user_id, dates);
            return result;
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "addAttendanceDetails");
        }
    }

    async addManagerRequest() {
        try {
            const validatedPayload = await this.schemaValidator.validateSchema(this.payload, userSchema.addManagerRequest());
            const { manager_id } = validatedPayload;
            if(this.payload.role_id != 1 && this.payload.user_id == manager_id) {
                throw Error("You can not set yourself as your manager.")
            }
            const commonUtility = new CommonUtility();
            let result = await commonUtility.addManagerRequest(this.payload.user_id, manager_id);
            sendManagerAssignmentRequestNotification(this.payload.user_id, manager_id);
            return result;
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "addManagerRequest");
        }
    }

}

module.exports = User;