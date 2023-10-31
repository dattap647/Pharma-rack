const Joi = require('joi');
class BaseSchemaValidator {
    validateSchema(payload, schema) {
        //  const errors =  schema.validate(payload, {abortEarly: true, stripUnknown: true});
        this.schema = schema;
        if (Array.isArray(payload) === true) {
            this.schema = Joi.array().items(schema);
        }
        let result = schema.validate(payload, { abortEarly: false, stripUnknown: true });
        if (result?.error?.details) {
            const errorMessage = result.error.details.map((detail) => {
                return detail.message
            }).join("; ");

            throw new CustomError(errorMessage, 400, "validateSchema");
        }
        return result?.value;

    }
}
module.exports = BaseSchemaValidator;