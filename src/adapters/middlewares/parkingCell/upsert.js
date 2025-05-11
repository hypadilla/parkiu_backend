const { body, validationResult } = require('express-validator');

const validateUpsertParkingCell = [
    body('idStatic')
        .isString()
        .withMessage('idStatic debe ser un string')
        .notEmpty()
        .withMessage('idStatic es obligatorio'),

    body('state')
        .isString()
        .withMessage('El estado debe ser un string')
        .isIn(['disponible', 'ocupado', 'reservado', 'inhabilitado'])
        .withMessage('Estado inválido. Debe ser uno de: disponible, ocupado, reservado, inhabilitado'),

    body('reservationDetails')
        .if(body('state').equals('reservado'))
        .custom((value) => {
            if (typeof value !== 'object' || value === null) {
                throw new Error('reservationDetails debe ser un objeto no nulo cuando el estado es "reservado"');
            }
            return true;
        }),

    body('reservationDetails.reservedBy')
        .if(body('state').equals('reservado'))
        .isString()
        .withMessage('reservedBy debe ser un string'),

    body('reservationDetails.startTime')
        .if(body('state').equals('reservado'))
        .isISO8601()
        .withMessage('startTime debe ser una fecha válida en formato ISO8601'),

    body('reservationDetails.endTime')
        .if(body('state').equals('reservado'))
        .isISO8601()
        .withMessage('endTime debe ser una fecha válida en formato ISO8601'),

    body('reservationDetails.reason')
        .optional()
        .isString()
        .withMessage('reason debe ser un string'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateUpsertParkingCell;
