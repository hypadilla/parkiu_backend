const { body, validationResult } = require('express-validator');

const validateUserRegister = [
    body('username')
        .isString()
        .withMessage('Username must be a string')
        .isLength({ min: 4 })
        .withMessage('Username must be at least 4 characters long'),
    body('password')
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('name')
        .isString()
        .withMessage('Name must be a string')
        .notEmpty()
        .withMessage('Name cannot be empty'),
    body('lastName')
        .isString()
        .withMessage('lastName must be a string')
        .notEmpty()
        .withMessage('lastName cannot be empty'),
    body('role')
        .isString()
        .withMessage('role must be a string')
        .notEmpty()
        .withMessage('role cannot be empty'),
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

module.exports = validateUserRegister ;
