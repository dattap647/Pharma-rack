const { getEnvVarAsString, getEnvVarAsInteger } = require('../utilities/env_utility');

/*
 * Commented/missing defaultValue indicates that the ENV VAR needs to be set explicitly
 * local development - set env var in .env
*/
// CRYPTO
const ENCRYPTION_TYPE = getEnvVarAsString({
    field: 'ENCRYPTION_TYPE',
    defaultValue: "aes-128-cbc",
});
// JWT
const JWT_SECRET_KEY = getEnvVarAsString({
    field: 'JWT_SECRET_KEY'
});

const TOKEN_EXPIRY_TIME = getEnvVarAsString({
    field: 'TOKEN_EXPIRY_TIME',
    defaultValue: "10h",
});

// SMTP
const SMTP_EMAIL = getEnvVarAsString({
    field: 'SMTP_EMAIL'
});

const SMTP_APP_KEY = getEnvVarAsString({
    field: 'SMTP_APP_KEY'
});
module.exports = {
    CRYPTO: {
        ENCRYPTION_TYPE
    },
    JWT: {
        JWT_SECRET_KEY,
        TOKEN_EXPIRY_TIME
    },
    SMTP: {
        SMTP_EMAIL,
        SMTP_APP_KEY
    }
}