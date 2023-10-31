const express = require("express");
const User = require("../../controllers/user/user");
const Admin = require("../../controllers/admin/admin")
const router = express.Router();

router.get("/user-details", async (req, res) => {
    try {
        const user = new User(req.params, req.body);
        const result = await user.getUsers();
        
        return responseHandler.sendSuccessResponse(res, result);
    } catch (error) {
        responseHandler.logError(error);
        return responseHandler.sendErrorResponse(res, error?.statusCode || 500, error?.message || error);
    }
})

router.get("/manager-list", async (req, res) => {
    try {
        const admin = new Admin(req.params, req.body);
        const result = await admin.getManagerUsers();
        
        return responseHandler.sendSuccessResponse(res, result);
    } catch (error) {
        responseHandler.logError(error);
        return responseHandler.sendErrorResponse(res, error?.statusCode || 500, error?.message || error);
    }
})

router.get("/attendance/:from_date/:to_date", async (req, res) => {
    try {
        const user = new User(req.params, req.body);
        const result = await user.getAttendanceDetails();
        
        return responseHandler.sendSuccessResponse(res, result);
    } catch (error) {
        responseHandler.logError(error);
        return responseHandler.sendErrorResponse(res, error?.statusCode || 500, error?.message || error);
    }
})

router.post("/attendance", async (req, res) => {
    try {
        const user = new User(req.params, req.body);
        const result = await user.addAttendanceDetails();
        
        return responseHandler.sendSuccessResponse(res, result);
    } catch (error) {
        responseHandler.logError(error);
        return responseHandler.sendErrorResponse(res, error?.statusCode || 500, error?.message || error);
    }
})

router.post("/manager-request", async (req, res) => {
    try {
        const user = new User(req.params, req.body);
        const result = await user.addManagerRequest();
        
        return responseHandler.sendSuccessResponse(res, result);
    } catch (error) {
        responseHandler.logError(error);
        return responseHandler.sendErrorResponse(res, error?.statusCode || 500, error?.message || error);
    }
})

module.exports = router;