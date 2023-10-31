const authToken = require('../common/jwt.auth');
const crypto = require('../common/crypto');

const IDLE_MESSAGE = 'Your Session has expired. The session will expire automatically, if the browser window is idle for a long time.';
const authorization = async (req, res, next) => {

    let response;
    try {
      if (!req.headers.authorization) {
        return responseHandler.sendErrorResponse(res, 401, "Token Missing!");
      };
  
      let crypto_decrypted_token = await crypto.decrypt(
        req.headers.authorization
      );
      response = await authToken.verifyToken(crypto_decrypted_token);
    } catch (error) {
    }
    if (response && response.data) {
     req.body.user_id = response.data.user_id;
     req.body.role_id = response.data.role_id;
    }
    else {
        return responseHandler.sendErrorResponse(res, 401, IDLE_MESSAGE);
    };
    next();
  }

  const isAdmin = async (req, res, next) => {
    try {
      if (req.body.role_id !== 1) {
        return responseHandler.sendErrorResponse(res, 401, "Access Denied for this User!");
      }
      next();
    }catch (error) {
      return error;
    }
  }

  const isManager = async (req, res, next) => {
    try {
      if (req.body.role_id !== 2) {
        return responseHandler.sendErrorResponse(res, 401, "Access Denied for this User!");
      }
      next();
    }catch (error) {
      return error;
    }
  }

  module.exports = {
    authorization,
    isAdmin,
    isManager
  }