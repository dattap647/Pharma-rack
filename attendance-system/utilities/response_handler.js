const winston = require("winston");
const fs = require("fs");
const logDir = "logs";

if(!fs.existsSync(logDir)){
    fs.mkdirSync(logDir);
}

 const infoLooger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: `${logDir}/${new Date().toDateString()}-info.log`,
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({timestamp, level, message})=> {
                    message = message instanceof Object ? JSON.stringify(message) : message;
                    return `========================================\n ${timestamp} : ${level}\n ${message} \n========================================`;
                })
            )
        })
    ]
 });

 const errorLooger = winston.createLogger({
    level: "error",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: `${logDir}/${new Date().toDateString()}-error.log`,
            level: "error",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
 });
 function logError(error) {
    error = {
        ...error,
        error_message: error?.message ?  error?.message : 'Unknown Error'
    }
    errorLooger.error(error);
};

function sendErrorResponse(res, status_code = 500, error) {
    try {
        const response = {
            success: false,
            error
        }
        res.status(status_code).send(response);
    } catch (error) {
        throw new CustomError(error, 500, "sendErrorResponse");
    }
};

 function sendSuccessResponse(res, data){
    try {
        const response = {
        success : true,
        data 
    }
    res.status(200).send(response);
    } catch (error) {
        throw new CustomError(error, 500, "sendSuccessResponse");
    }
    
 };

 module.exports = {
    sendErrorResponse,
    sendSuccessResponse,
    logError
 };