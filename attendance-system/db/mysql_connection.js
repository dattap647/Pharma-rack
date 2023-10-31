const mysql = require("mysql2");
const dbConfig = require("./config").mysql_config;

let poolConnect = null;
const connectDB = async()=>{
    try {
        if(poolConnect){
            return poolConnect;
        }
        poolConnect = await mysql.createPool(dbConfig);

        poolConnect.getConnection( (err, connection) => {
            if(err){
                console.log("MySQL Connection Error!", err);
                throw err;
            }else{
                console.log("MySQL Connected!");
                connection.release();
            }
        });

        return poolConnect;
    } catch (error) {
        console.log("Connection Error!", error);
       throw error;
    }
}

const executeQuery = async (query, data) => {
    try {
        return await poolConnect.promise().query(query, data);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    connectDB,
    executeQuery
}
