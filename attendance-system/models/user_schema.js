const Joi = require('joi');

const userSchema = {
    userRegistartionSchema : () => Joi.object().keys({
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
        first_name: Joi.string().min(2).required().messages({
            'string.base' : 'First name must be a string',
            'string.min' : 'First name must be {#limit} characters long',
            'string.empty' : 'First name is required',
            'string.required' : 'First name is required'
        }),
        last_name: Joi.string().min(2).required().messages({
            'string.base' : 'Last name must be a string',
            'string.min' : 'Last name must be {#limit} characters long',
            'string.empty' : 'Last name is required',
            'string.required' : 'Last name is required'
        }),
        role_id : Joi.number().required().valid(2, 3).messages({
            'number.base' : 'Role ID must be a number',
            'number.empty' : 'Role ID is required',
            'number.required' : 'Role ID is required',
            'any.only' : "Role ID must be 2 or 3"
        }),
        manager_id : Joi.when('role_id', {
            is: 3,
            then: Joi.number().required().messages({
                'number.base' : 'Manager ID must be a number',
                'number.empty' : 'Manager ID is required',
                'number.required' : 'Manager ID is required'
            }),
            otherwise: Joi.number().allow(null).messages({
                'number.base' : 'Manager ID must be a number'
            })
        })
        
    }),
    userLoginSchema : () => Joi.object().keys({
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
        })
    }),
    getAttendanceSchema: () => Joi.object().keys({
        from_date : Joi.date().required().messages({
            'date.base' : 'From date is invalid'
        }),
        to_date : Joi.date().required().messages({
            'date.base' : 'To date is invalid'
        }),
    }),

    addAttendanceSchema : () => Joi.object().keys({
        dates : Joi.array().items(
            Joi.date().required().messages({
                'date.base' : 'Date must be a valid date'
            })
        ),
        logged_hours : Joi.number().required().messages({
            'number.base' : 'Logged hours must be a number',
            'number.empty' : 'Logged hours is required',
            'number.required' : 'Logged hours is required'
        })
    }),

    addManagerRequest : () => Joi.object().keys({
        manager_id : Joi.number().required().messages({
            'number.base' : 'Manager ID must be a number',
            'number.empty' : 'Manager ID is required',
            'number.required' : 'Manager ID is required'
        })
    }),

    updateManagerRequest : () => Joi.object().keys({
        id : Joi.number().required().messages({
            'number.base' : 'ID must be a number',
            'number.empty' : 'ID is required',
            'number.required' : 'ID is required'
        }),
        status : Joi.string().required().valid('Approved', 'Rejected').messages({
            'string.base' : 'Status must be a string',
            'string.empty' : 'Status is required',
            'string.required' : 'Status is required',
            'any.only' : 'Status must be Approved or Rejected'
        })
    }),

    updateUserStatus : () => Joi.object().keys({
        id : Joi.number().required().messages({
            'number.base' : 'User ID must be a number',
            'number.empty' : 'User ID is required',
            'number.required' : 'User ID is required'
        }),
        status : Joi.string().required().valid('active', 'blocked').messages({
            'string.base' : 'Status must be a string',
            'string.empty' : 'Status is required',
            'string.required' : 'Status is required',
            'any.only' : 'Status must be active or blocked'
        })
    }),
    
    updateAttendanceSchema : () => Joi.object().keys({
        attendance_ids : Joi.array().required().items(
            Joi.number().required().messages({
                'number.base' : 'AttendanceID must be a number',
                'number.empty' : 'AttendanceID is required',
                'number.required' : 'AttendanceID is required'
            })
        ),
        status : Joi.string().required().valid('Approved', 'Rejected').messages({
            'string.base' : 'Status must be a string',
            'string.empty' : 'Status is required',
            'string.required' : 'Status is required',
            'any.only' : 'Status must be Approved or Rejected'
        })
    }),

    approveUserByToken :   () => Joi.object().keys({
        token : Joi.string().required().messages({
            'string.base' : 'Token must be a string',
            'string.empty' : 'Token is required',
            'string.required' : 'Token is required',
        }),
        status : Joi.string().required().valid('active', 'blocked').messages({
            'string.base' : 'Status must be a string',
            'string.empty' : 'Status is required',
            'string.required' : 'Status is required',
            'any.only' : 'Status must be active or blocked'
        })
    }),

    approveAttendanceByToken :   () => Joi.object().keys({
        token : Joi.string().required().messages({
            'string.base' : 'Token must be a string',
            'string.empty' : 'Token is required',
            'string.required' : 'Token is required',
        }),
        status : Joi.string().required().valid('Approved', 'Rejected').messages({
            'string.base' : 'Status must be a string',
            'string.empty' : 'Status is required',
            'string.required' : 'Status is required',
            'any.only' : 'Status must be Approved or Rejected'
        })
    }),
}

module.exports = userSchema ;