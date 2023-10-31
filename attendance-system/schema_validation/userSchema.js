const Joi = require("joi");

const userRegistartionSchema = Joi.object({
    username: Joi.string().min(3).required().messages({
        'string.base' : 'Username must be a string',
        'string.min' : 'Username must be {#limit} characters long',
        'string.empty' : 'Username is required',
        'string.required' : 'Username is required'
    }),
    email : Joi.string().email().required().messages({
        'string.base' : 'Email must be a string',
        'string.email' : 'Invalid email address',
        'string.empty' : 'Email is required',
        'string.required' : 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.base' : 'Password must be a string',
        'string.min' : 'Password must be {#limit} characters long',
        'string.empty' : 'Password is required',
        'string.required' : 'Password is required'
    }),
    firstname: Joi.string().min(2).required().messages({
        'string.base' : 'Firstname must be a string',
        'string.min' : 'Firstname must be {#limit} characters long',
        'string.empty' : 'Firstname is required',
        'string.required' : 'Firstname is required'
    }),
    lastname: Joi.string().min(1).required().messages({
        'string.base' : 'Lastname must be a string',
        'string.min' : 'Lastname must be {#limit} characters long',
        'string.empty' : 'Lastname is required',
        'string.required' : 'Lastname is required'
    }),
    dob: Joi.date().required().messages({
        'date.base' : 'DOB must be a date',
        'date.empty' : 'DOB is required',
        'date.required' : 'DOB is required'
    }),

}).options({
    abortEarly: false
});

const userLoginSchema = Joi.object({
    usernameOrEmail: Joi.alternatives().try(Joi.string().email().required().messages({
        'string.base' : 'Email must be a string',
        'string.email' : 'Invalid email address',
        'string.empty' : 'Email is required',
        'string.required' : 'Email is required'
    }), Joi.string().min(3).required().messages({
        'string.base' : 'Username must be a string',
        'string.min' : 'Username must be {#limit} characters long',
        'string.empty' : 'Username is required',
        'string.required' : 'Username is required'
    })).required().messages({
        'alternatives.match' : 'Invalid Username or Email'
    }),
    password: Joi.string().min(6).required().messages({
        'string.base' : 'Password must be a string',
        'string.min' : 'Password must be {#limit} characters long',
        'string.empty' : 'Password is required',
        'string.required' : 'Password is required'
    })
}).options({
    abortEarly: false
});

module.exports = {
    userRegistartionSchema,
    userLoginSchema
}