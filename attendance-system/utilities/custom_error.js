class CustomError extends Error {

    constructor( message, statusCode, functionName, messageCode = null, data = null) {
      super(message);
      Error.captureStackTrace(this, CustomError);
      this.name = (this).constructor.name; // OR this.name = (<any>this).constructor.name;
      this.statusCode = statusCode;
      this.functionName = functionName
      this.messageCode = messageCode
      this.data = data
    }
  
  };

module.exports = CustomError;