'use strict';

const Yup = require('yup');

const getEnvVariableSync = (fieldName) => {
  if (Yup.string().required().min(1).isValidSync(process.env[fieldName])) {
    return process.env[fieldName];
  }

  return null;
};
function getEnvVarAsString({ field, defaultValue, minLength = 0 }) {
  const value = getEnvVariableSync(field);

  if (!value && !defaultValue) {
    throw new Error(
      `Env var ${field} does not have a default value and is null, please provide a value or define a default value.`,
    );
  }
  if (!Yup.string().required().min(minLength).trim().strict().isValidSync(value)) {
    return defaultValue;
  }

  return value.trim();
}

const getEnvVarAsInteger = ({ field, defaultValue, minValue = 0 }) => {
  const value = getEnvVariableSync(field);

  const isValid = Yup.number().required().integer().min(minValue).isValidSync(value);

  if (!isValid) {
    return defaultValue;
  }

  return Number.parseInt(value, 10);
};

const getEnvVarAsFloat = ({ field, defaultValue, minValue = 0 }) => {
  const value = getEnvVariableSync(field);

  const isValid = Yup.number().required().min(minValue).isValidSync(value);

  if (!isValid) {
    return defaultValue;
  }

  return Number.parseFloat(value, 10);
};

const getEnvVariableAsArray = ({ field, defaultValue, minLength = 1 }) => {
  const value = getEnvVariableSync(field);
  const defaultArrayValue = defaultValue ? defaultValue.split(',').map((x) => x.trim()) : [];

  if (!value) {
    return defaultArrayValue;
  }

  const array = value.split(',');

  const isArray = Yup.array().required().min(minLength).isValidSync(array);

  if (!isArray) {
    return defaultArrayValue;
  }

  return array;
};

module.exports = {
  getEnvVarAsString,
  getEnvVarAsInteger,
  getEnvVarAsFloat,
  getEnvVariableAsArray
};
