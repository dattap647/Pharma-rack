const BaseSchemaValidator = require('../../common/schema_validator');
const CommonUtility = require('../../utilities/common_utility');
const userSchema = require('../../models/user_schema');
const { addAttendanceNotification, sendManagerAssignmentRequestNotification} = require('../../common/mail_template');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

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
            let changed_response = users.map(user => {
                user.date = moment(user.date).endOf().format("YYYY-MM-DD");
                return user;
            })
            return changed_response;
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "getUsers");
        }
    }

    async addAttendanceDetails() {
        try {
            
            const validatedPayload = await this.schemaValidator.validateSchema(this.payload, userSchema.addAttendanceSchema());
            //const { dates, logged_hours} = validatedPayload;
            let dates = [];
            const result = [];
            
            const uuid = uuidv4();
            for (let i = 0; i < validatedPayload.length; i++){
                const data = {
                    user_id : this.payload.user_id,
                    date : validatedPayload[i].date,
                    logged_hours : validatedPayload[i].logged_hours,
                    uuid 
                }
                let date_formatted = moment(validatedPayload[i].date).format("YYYY-MM-DD");
                dates.push(date_formatted);
                const commonUtility = new CommonUtility();
                result.push(await commonUtility.addUserAttendance(data));
            }
            addAttendanceNotification(this.payload.user_id, dates, uuid);
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