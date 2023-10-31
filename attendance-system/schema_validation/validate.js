const { body, validationResult } = require("express-validator");
const { handleCustomError } = require("../uttility/responseHandler");

const userRegisterRule = [
    body('username').isLength({ min : 3 }).withMessage("User name must be at least 3 characters long"),
    body('email').isEmail().withMessage("Invalid email address"),
    body('password').isLength({ min : 6 }).withMessage("Password must be at least 6 characters long"),
    body('firstname').isLength({ min : 3 }).withMessage("First name must be at least 3 characters long"),
    body('lastname').isLength({ min : 3 }).withMessage("Last name must be at least 3 characters long"),
    body('dob').isDate().withMessage("DOB must be valid date"),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if(errors.isEmpty()){
        return next();
    }

    const errorResult = errors?.errors.map( item => {
        return item.msg;
    })

    return res.status(400).send(handleCustomError(errorResult.join(", ")));
}

module.exports = {
    userRegisterRule,
    validate
}