const express = require("express");
const router = express.Router();
const authRouter = require('../routes/auth/auth');
const adminRouter = require('../routes/admin/admin');
const managerRouter = require('../routes/manager/manager');
const userRouter = require('../routes/user/user');
const { authorization, isAdmin, isManager } = require('../middleware/authorization');
router.use('/auth', authRouter);

router.use(authorization);
router.use('/admin', isAdmin, adminRouter);
router.use('/manager', isManager, managerRouter);
router.use('/user', userRouter);
module.exports = router;
