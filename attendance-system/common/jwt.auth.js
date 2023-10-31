const jwt = require('jsonwebtoken');
const { JWT: { JWT_SECRET_KEY, TOKEN_EXPIRY_TIME } } = require('../environment');
const options = { expiresIn: TOKEN_EXPIRY_TIME };
let encrypt = (user) => {
    return jwt.sign({
        data: user
      }, JWT_SECRET_KEY, options)
}
let verifyToken = (authToken, ignoreExpiration = false) => {
    try {
        let tokenOptions = options;

        if(ignoreExpiration){
            tokenOptions = { ignoreExpiration }
        };
        return jwt.verify(authToken, JWT_SECRET_KEY, tokenOptions);
    } catch (error) {
        return error;
        //res.sendStatus(403);    
    }
}

let decrypt = (req, res) => {
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        return true;
    } else {
        // Forbidden
        res.sendStatus(403);
        return false;
    }
}

module.exports = {
    encrypt, verifyToken
}