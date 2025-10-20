const errorHandler = require('../../../src/adapters/middlewares/errorHandler');
const logger = require('../../../src/core/utils/logger');

// Mock logger
jest.mock('../../../src/core/utils/logger');

describe('ErrorHandler', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('error handling', () => {
    it('should handle ValidationError with 400 status', () => {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          type: 'ValidationError',
          message: 'Validation failed'
        }
      });
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle UnauthorizedError with 401 status', () => {
      const error = new Error('Unauthorized');
      error.name = 'UnauthorizedError';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          type: 'UnauthorizedError',
          message: 'No autorizado'
        }
      });
    });

    it('should handle NotFoundError with 404 status', () => {
      const error = new Error('User not found');
      error.name = 'NotFoundError';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          type: 'NotFoundError',
          message: 'User not found'
        }
      });
    });

    it('should handle already exists error with 400 status', () => {
      const error = new Error('User already exists');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          type: 'Error',
          message: 'User already exists'
        }
      });
    });

    it('should handle error with custom statusCode', () => {
      const error = new Error('Custom error');
      error.statusCode = 422;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          type: 'Error',
          message: 'Custom error'
        }
      });
    });

    it('should handle generic error with 500 status', () => {
      const error = new Error('Generic error');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          type: 'Error',
          message: 'Ocurrió un error interno en el servidor'
        }
      });
    });

    it('should include stack trace in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Test error');
      error.stack = 'Error stack trace';

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        error: {
          type: 'Error',
          message: 'Ocurrió un error interno en el servidor',
          stack: 'Error stack trace'
        }
      });

      process.env.NODE_ENV = originalEnv;
    });

    it('should not include stack trace in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Test error');
      error.stack = 'Error stack trace';

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        error: {
          type: 'Error',
          message: 'Ocurrió un error interno en el servidor'
        }
      });

      process.env.NODE_ENV = originalEnv;
    });

    it('should handle error without name', () => {
      const error = { message: 'Error without name' };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          type: 'InternalServerError',
          message: 'Ocurrió un error interno en el servidor'
        }
      });
    });

    it('should handle ValidationError without message', () => {
      const error = { name: 'ValidationError' };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          type: 'ValidationError',
          message: 'Datos de entrada inválidos'
        }
      });
    });

    it('should handle NotFoundError without message', () => {
      const error = { name: 'NotFoundError' };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          type: 'NotFoundError',
          message: 'Recurso no encontrado'
        }
      });
    });
  });
});