const express = require("express");
const app = express();

const startTime = app.use( (req, res, next) => {
    req.startTime = new Date();
    next();
})

module.exports = startTime;