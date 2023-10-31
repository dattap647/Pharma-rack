const User = require("../model/user");
const { handleCustomError } = require("../uttility/responseHandler");

class commanFunction {
    async getUserByUsernameOrEmail(username, email){
        try {
            return await User.findOne({$or : [{username}, {email}]}).select('-_id');
        } catch (error) {
            throw handleCustomError(error, 500);
        }
    }
}

module.exports = commanFunction;