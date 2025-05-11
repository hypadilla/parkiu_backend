const { param, validationResult } = require('express-validator');

const validateGetUserUsername = [
    param('username')
        .isString()
        .withMessage('username must be a string')
        .notEmpty()
        .withMessage('username cannot be empty'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateGetUserUsername;
