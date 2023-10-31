const express = require('express');
const bodyParser = require('body-parser');

// Set up Global configuration access
const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');
const { connectDB } = require('./db/mysql_connection');
global.CustomError = require('./utilities/custom_error');
global.responseHandler = require('./utilities/response_handler');
const rootRouter = require('./routes/index');
const cors = require('cors');
var helmet = require('helmet');

//middleware
const startTimeMiddleware = require('./middleware/start_time');
connectDB()
    .then(() => {
        const app = express();

        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended : false}));
        app.use(helmet());
        
        let PORT = process.env.PORT || 5000;
        app.use(startTimeMiddleware);
        app.use("/attendance-management/v1",rootRouter);

        process.on("uncaughtException", (error) => {
            console.log("Uncaught Exception", error);
            return error;
        });

        app.listen(PORT, () => {
            console.log(`Server is up and running on ${PORT} ...`);
        });
    }).catch((error) => {
        console.log(error);
    });
