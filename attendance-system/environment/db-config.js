const { getEnvVarAsString, getEnvVarAsInteger } = require('../utilities/env_utility');

/*
 * Commented/missing defaultValue indicates that the ENV VAR needs to be set explicitly
 * local development - set env var in .env
*/
// SQL
const DB_HOST = getEnvVarAsString({
    field: 'DB_HOST',
    // defaultValue: "get_from_person_incharge",
});

const DB_USER = getEnvVarAsString({
    field: 'DB_USER',
    // defaultValue: "get_from_person_incharge",
});

const DB_PASSWORD = getEnvVarAsString({
    field: 'DB_PASSWORD',
    // defaultValue: "get_from_person_incharge",
});

const DB_PORT = getEnvVarAsInteger({
    field: 'DB_PORT',
    // defaultValue: "get_from_person_incharge",
});

const DB_NAME = getEnvVarAsString({
    field: 'DB_NAME',
    // defaultValue: "get_from_person_incharge",
});

module.exports = {
    MYSQL: {
        DB_HOST,
        DB_USER,
        DB_PASSWORD,
        DB_PORT,
        DB_NAME
    }
}