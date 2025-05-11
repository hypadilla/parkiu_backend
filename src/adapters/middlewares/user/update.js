const { param, body, validationResult } = require('express-validator');

const validateUserUpdate = [
    param('id')
        .isString()
        .withMessage('id must be a string')
        .notEmpty()
        .withMessage('id cannot be empty'),

    body('password')
        .optional()
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),

    body('email')
        .optional()
        .isEmail()
        .withMessage('Email must be valid'),

    body('name')
        .optional()
        .isString()
        .withMessage('Name must be a string'),

    body('lastName')
        .optional()
        .isString()
        .withMessage('lastName must be a string'),

    body('role')
        .optional()
        .isString()
        .withMessage('role must be a string'),

    body('permissions')
        .optional()
        .isArray()
        .withMessage('Permissions must be an array of strings'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateUserUpdate;
