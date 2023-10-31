const BaseSchemaValidator = require('../../common/schema_validator');
const userSchema = require('../../models/user_schema');
const bcrypt = require("bcrypt");
const {SALT_ROUND} = require('../../environment');
const { executeQuery } = require('../../db/mysql_connection');
const CommonUtility = require('../../utilities/common_utility');
const { registerUserNotification} = require('../../common/mail_template');

class Auth {
    constructor(param, payload, file = null) {
        this.param = param;
        this.payload = payload;
        this.schemaValidator = new BaseSchemaValidator();
    }

    async register() {
        try {
            const validatedPayload = await this.schemaValidator.validateSchema(this.payload, userSchema.userRegistartionSchema());
            validatedPayload.password = await bcrypt.hash(validatedPayload.password, SALT_ROUND);
            // Save user data to the database
            const commonUtility = new CommonUtility();
            const result = await commonUtility.addUser(validatedPayload);
            if(result.affectedRows > 0 ) {
                if(validatedPayload?.manager_id) {
                    registerUserNotification(result?.insertId, validatedPayload?.manager_id);
                }
                return {
                    message: "User added successfully."
                }
            } else{
                throw "User not added!";
            }
             
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "register");
        }
    }

    async login(){
        try {
            const validatedPayload = await this.schemaValidator.validateSchema(this.payload, userSchema.userLoginSchema());
            const { email, password } = validatedPayload;
            this.commonUtility = new CommonUtility();
            const user = await this.commonUtility.getUserByEmail(email);

            if(!user){
                throw new CustomError("Invalid Credentials!", 400);
            } else if(user?.status != 'active' ){
                throw new CustomError("User account not active! Please contact Admin or Manager to appove your account.", 401);
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                const token = await this.commonUtility.generateAuthToken(user);
                return {
                    user_id : user.user_id,
                    role : user.role_id,
                    token
                };
            } else {
                throw new CustomError("Invalid credentials",400, "login");
            }
            
            
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "login");
        }
    }

    async getManagerUsers() {
        try {
            const commonUtility = new CommonUtility(this.payload);
            let users = await commonUtility.getManagerUsersPublic();
            return users;
        } catch (error) {
            throw new CustomError(error, error?.statusCode || 500, "getManagerUsers");
        }
    }
}

module.exports = Auth;