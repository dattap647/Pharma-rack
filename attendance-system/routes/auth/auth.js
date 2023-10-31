const express = require("express");
const Auth = require("../../controllers/auth/auth");
const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const auth = new Auth(req.params, req.body);
        const result = await auth.register();
        
        return responseHandler.sendSuccessResponse(res, result);
    } catch (error) {
        responseHandler.logError(error);
        return responseHandler.sendErrorResponse(res, error?.statusCode || 500, error?.message || error);
    }
})

router.post("/login", async (req, res) => {
    try {
        const auth = new Auth(req.params, req.body);
        const result = await auth.login();
       
        return responseHandler.sendSuccessResponse(res, result);
    } catch (error) {
        responseHandler.logError(error);
        return responseHandler.sendErrorResponse(res, error?.statusCode || 500, error?.message || error);
    }
})

router.get("/manager-list", async (req, res) => {
    try {
        const auth = new Auth(req.params, req.body);
        const result = await auth.getManagerUsers();
        
        return responseHandler.sendSuccessResponse(res, result);
    } catch (error) {
        responseHandler.logError(error);
        return responseHandler.sendErrorResponse(res, error?.statusCode || 500, error?.message || error);
    }
})

module.exports = router;