const express = require("express");
const Admin = require("../../controllers/admin/admin");
const Manager = require("../../controllers/manager/manager");

const router = express.Router();

router.get("/users-list", async (req, res) => {
    try {
        const admin = new Admin(req.params, req.body);
        const result = await admin.getUsers();
        
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

router.get("/users-list/:manager_id", async (req, res) => {
    try {
        const admin = new Admin(req.params, req.body);
        const result = await admin.getUsersByManager();
        
        return responseHandler.sendSuccessResponse(res, result);
    } catch (error) {
        responseHandler.logError(error);
        return responseHandler.sendErrorResponse(res, error?.statusCode || 500, error?.message || error);
    }
})

router.post("/change-user-role", async (req, res) => {
    try {
        const admin = new Admin(req.params, req.body);
        const result = await admin.changeUserRole();
       
        return responseHandler.sendSuccessResponse(res, result);
    } catch (error) {
        responseHandler.logError(error);
        return responseHandler.sendErrorResponse(res, error?.statusCode || 500, error?.message || error);
    }
})

router.get("/all-attendance/:status?", async (req, res) => {
    try {
        const admin = new Admin(req.params, req.body);
        const result = await admin.allattendanceRecords();
        
        return responseHandler.sendSuccessResponse(res, result);
    } catch (error) {
        responseHandler.logError(error);
        return responseHandler.sendErrorResponse(res, error?.statusCode || 500, error?.message || error);
    }
})

router.get("/attendance/:status?", async (req, res) => {
    try {
        const manager = new Manager(req.params, req.body);
        const result = await manager.attendanceRecordsByManager();
        
        return responseHandler.sendSuccessResponse(res, result);
    } catch (error) {
        responseHandler.logError(error);
        return responseHandler.sendErrorResponse(res, error?.statusCode || 500, error?.message || error);
    }
})

router.put("/attendance", async (req, res) => {
    try {
        const manager = new Manager(req.params, req.body);
        const result = await manager.updateAttendanceDetails();
        
        return responseHandler.sendSuccessResponse(res, result);
    } catch (error) {
        responseHandler.logError(error);
        return responseHandler.sendErrorResponse(res, error?.statusCode || 500, error?.message || error);
    }
})

router.post("/change-user-role", async (req, res) => {
    try {
        const auth = new Auth(req.params, req.body);
        const result = await auth.login();
       
        return responseHandler.sendSuccessResponse(res, result);
    } catch (error) {
        responseHandler.logError(error);
        return responseHandler.sendErrorResponse(res, error?.statusCode || 500, error?.message || error);
    }
})

router.get("/manager_requests", async (req, res) => {
    try {
        const admin = new Admin(req.params, req.body);
        const result = await admin.getManagerRequests();
        
        return responseHandler.sendSuccessResponse(res, result);
    } catch (error) {
        responseHandler.logError(error);
        return responseHandler.sendErrorResponse(res, error?.statusCode || 500, error?.message || error);
    }
})

router.put("/update-manager_requests/:id/:status", async (req, res) => {
    try {
        const manager = new Manager(req.params, req.body);
        const result = await manager.updateManagerRequest();
        
        return responseHandler.sendSuccessResponse(res, result);
    } catch (error) {
        responseHandler.logError(error);
        return responseHandler.sendErrorResponse(res, error?.statusCode || 500, error?.message || error);
    }
})

router.put("/user/:id/:status", async (req, res) => {
    try {
        const manager = new Manager(req.params, req.body);
        const result = await manager.updateUserStatus();
        
        return responseHandler.sendSuccessResponse(res, result);
    } catch (error) {
        responseHandler.logError(error);
        return responseHandler.sendErrorResponse(res, error?.statusCode || 500, error?.message || error);
    }
})

module.exports = router;