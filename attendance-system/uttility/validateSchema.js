const Joi = require("joi");
const { handleCustomError } = require("./responseHandler");

const validateSchema = async (payload, schema) => {
    try {
        const errors = await schema.validate(payload);
        
        if(errors?.error?.details){
            const errorMessage = errors.error.details.map((detail) => {
                return detail.message
            }).join("; ");

            throw errorMessage;
        }
        return errors?.value;


    } catch (error) {
        throw handleCustomError(error, 400);
    }
}

module.exports =  validateSchema;