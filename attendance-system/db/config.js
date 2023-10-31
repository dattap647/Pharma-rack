const {
    MYSQL: {
        DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME
    }
} = require('../environment');

let mysql_config = {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_NAME
}

module.exports = {
    mysql_config
}