const Joi = require('joi');

const adminSchema = {
    manager : () => Joi.object().keys({
        manager_id : Joi.number().required().messages({
            'number.base' : 'ManagerID must be a number',
            'number.empty' : 'ManagerID is required',
            'number.required' : 'ManagerID is required'
        }),
    }),
    changeUserRole : () => Joi.object().keys({
        user_ids : Joi.array().items(
            Joi.number().required().messages({
                'number.base' : 'UserId must be a number',
                'number.empty' : 'UserId is required',
                'number.required' : 'UserId is required'
            })
        ),
        role : Joi.number().required().valid(1,2,3).messages({
            'number.base' : 'RoleID must be a number',
            'number.empty' : 'RoleID is required',
            'number.required' : 'RoleID is required',
            'any.only' : 'RoleID must be valid role'
        }),
    }),
}

module.exports = adminSchema ;