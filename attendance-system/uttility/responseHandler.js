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
                winston.format.printf(({timestamp, message})=> {
                    message = message instanceof Object ? JSON.stringify(message) : message;
                    return `========================================\n ${timestamp} \n ${message} \n========================================`;
                })
            )
        })
    ]
 });

 const validationLooger = winston.createLogger({
    level: "error",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: `${logDir}/${new Date().toDateString()}-validation-error.log`,
            level: "error",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({timestamp, message})=> {
                    message = message instanceof Object ? JSON.stringify(message) : message;
                    return `========================================\n ${timestamp} \n ${message} \n========================================`;
                })
            )
        })
    ]
 });

 const apiLooger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: `${logDir}/${new Date().toDateString()}-api.log`,
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
 })

function handleCustomError(err, status_code = 500) {
    const message = err?.message ? err?.message : err;

    errorLooger.error(message);
    return {
        success: false,
        status_code,
        error_code: err?.error_code ? err?.error_code : 123456,
        error_message: message
    }
};

 function logAPICall(req, res) {
    let date  = new Date();
    apiLooger.info({
        message: 'API Call Log',
        timestamp: date,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        responseTime: `${date - req.startTime} ms`
    })
 }

 function handleCustomResponse(data){
    infoLooger.info(data);
    return {
        success : true,
        data 
    }
 };

 module.exports = {
    handleCustomError,
    handleCustomResponse,
    logAPICall
 };