const logger = require('../../core/utils/logger');

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Ocurrió un error interno en el servidor';

    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message || 'Datos de entrada inválidos';
    } else if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'No autorizado';
    } else if (err.name === 'NotFoundError') {
        statusCode = 404;
        message = err.message || 'Recurso no encontrado';
    } else if (err.message && err.message.includes('already exists')) {
        statusCode = 400;
        message = err.message;
    } else if (err.statusCode) {
        statusCode = err.statusCode;
        message = err.message;
    }

    const errorResponse = {
        error: {
            type: err.name || 'InternalServerError',
            message,
        },
    };

    if (process.env.NODE_ENV === 'development') {
        errorResponse.error.stack = err.stack;
    }

    logger.error('Error manejado por errorHandler', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        statusCode
    });

    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
