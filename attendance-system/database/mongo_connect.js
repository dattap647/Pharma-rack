const mongoose = require("mongoose");

const user_name = encodeURIComponent(process.env.MONGO_USER);
const password = encodeURIComponent(process.env.MONGO_PASS);

const dbUrl = `mongodb+srv://${user_name}:${password}@cluster0.woxqy.mongodb.net`;
let isConnected = false;
let db;
const connectToDB = async() => {
    try {
        if(isConnected){
            return db;
        }
    
        db = await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Mongodb Connected!");
        return db;
    } catch (error) {
        console.log("Mongodb Not Connected!", error);
        throw error;
    }
}

module.exports = {
    connectToDB
};

// mongoose.connect(dbUrl,{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// const db = mongoose.connection;

// db.on('error', console.log("Mongodb Connection Error!"));

// db.once('open', () => {
//     console.log("Mongodb Connected!");
// })