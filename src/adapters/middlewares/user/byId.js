const { param, validationResult } = require('express-validator');

const validateGetUserId = [
    param('id')
        .isString()
        .withMessage('User Id must be a string')
        .notEmpty()
        .withMessage('User Id cannot be empty'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateGetUserId;
