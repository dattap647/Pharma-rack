'use strict';

const DatabaseConfig = require('./db-config');
const CredintialConfig = require('./credentials-config');

const { getEnvVarAsString, getEnvVarAsInteger, getEnvVarAsFloat, getEnvVariableAsArray } = require('../utilities/env_utility');

/*
 * Commented/missing defaultValue indicates that the ENV VAR needs to be set explicitly
 * local development - set env var in .env
*/
const PORT = getEnvVarAsInteger({
  field: 'PORT',
  defaultValue: 3001,
});

const NODE_ENV = getEnvVarAsString({
  field: 'NODE_ENV',
  defaultValue: "development",
});
const ENVIRONMENT = getEnvVarAsString({
  field: 'ENVIRONMENT'
});
const CRYPTO_SECREATE_KEY = getEnvVarAsString({
  field: 'CRYPTO_SECREATE_KEY',
  defaultValue: "ABCDEFGHIJKLMNOPabcdefghijklmnop"
});
const SALT_ROUND = getEnvVarAsInteger({
    field: 'SALT_ROUND',
    defaultValue: 10
  });

module.exports = {
  PORT,
  CRYPTO_SECREATE_KEY,
  NODE_ENV,
  ENVIRONMENT,
  SALT_ROUND,
  ...DatabaseConfig,
  ...CredintialConfig
};
