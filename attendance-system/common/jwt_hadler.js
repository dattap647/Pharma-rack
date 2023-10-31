const jwt = require("jsonwebtoken");
const { handleCustomError } = require("../uttility/responseHandler");
const CryptoJs = require("crypto-js");
const jwt_key = process.env.JWT_KEY;
const token_secret_key = process.env.TOKEN_ENCRYPT_KEY;

const generateToken = async(data) => {
    try {
        const user_id = data.user_id;
        const token = jwt.sign({user_id},jwt_key,{expiresIn: 3600});
        return CryptoJs.AES.encrypt(token, token_secret_key).toString();
    } catch (error) {
        throw error;
    }
}

const verifyToken = async(token) => {
    try {
        const bytes = CryptoJs.AES.decrypt(token, token_secret_key);
        const decryptedToken = bytes.toString(CryptoJs.enc.Utf8);
        const result = await jwt.verify(decryptedToken,jwt_key, (err, user) => {
            if(err){
                throw handleCustomError("Unauthorized!", 400);
            }
            return user;
        });
        return result;
    } catch (error) {
        throw error
    }
}

module.exports = {
    generateToken,
    verifyToken
}