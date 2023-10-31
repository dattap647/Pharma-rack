const bcrypt = require("bcrypt");
const User = require("../../model/user");
const { getNextID } = require("../../uttility/counter");
const saltRounds = parseInt(process.env.SALT_ROUND);

const { userRegistartionSchema, userLoginSchema } = require('../../schema_validation/userSchema');
const validateSchema = require('../../uttility/validateSchema');
const commanFunction = require('../../common/common_function');
const { handleCustomError } = require("../../uttility/responseHandler");
const { generateToken, verifyToken } = require("../../common/jwt_hadler");
class Auth {
    constructor(param, payload, file = null){
        this.param = param;
        this.payload = payload;
        this.commanUtil = new commanFunction();
    }

    async register() {
        try {
            const validatedPayload = await validateSchema(this.payload, userRegistartionSchema);
            const { username, password, email } = validatedPayload;
            const isUserExists = await this.commanUtil.getUserByUsernameOrEmail(username, email);
            if(isUserExists){
                throw handleCustomError("Username or email already registerd with us!", 400);
            }
            validatedPayload.user_id = await getNextID("user_id");
            validatedPayload.password = await bcrypt.hash(password, saltRounds);
            const newUser = new User(validatedPayload);
            await newUser.save();
            return {
                message : "User Created!"
            };
        } catch (error) {
            if(error.code === 11000){
                throw handleCustomError("Invalid client assertion provided!", 400);
            }
            throw error;
        }
    }

    async login() {
        try {
            const validatedPayload = await validateSchema(this.payload, userLoginSchema);
            const { usernameOrEmail, password } = validatedPayload;
            const user = await this.commanUtil.getUserByUsernameOrEmail(usernameOrEmail, usernameOrEmail);

            if(!user){
                throw handleCustomError("Invalid Credentials!", 400);
            }
            
            const tokenData = {
                user_id : user.user_id
            }

            const token = await generateToken(tokenData);
            return {
                user_id: user.user_id,
                token
            };
        } catch (error) {
            throw error;
        }
    }

    async verifyJWTToken() {
        try {
            const token = this.payload?.token || "";
            return await verifyToken(token);
            
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Auth;