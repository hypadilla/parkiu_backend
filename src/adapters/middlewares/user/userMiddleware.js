const validateUserRegister = require('./create');
const validateUserDelete = require('./delete');
const validateUserUpdate = require('./update');
const validateGetUserId = require('./byId');
const validateGetUserUsername = require('./byUsername');

module.exports = {
    validateUserRegister,
    validateUserDelete,
    validateUserUpdate,
    validateGetUserId,
    validateGetUserUsername,
};
