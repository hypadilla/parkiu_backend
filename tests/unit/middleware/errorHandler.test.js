const errorHandler = require('../../../src/adapters/middlewares/errorHandler');
const logger = require('../../../src/core/utils/logger');

// Mock logger
jest.mock('../../../src/core/utils/logger');

describe('errorHandler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('Generic Errors', () => {
    it('should handle generic errors with status 500', () => {
      const error = new Error('Something went wrong');
      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Ocurrió un error interno en el servidor',
          type: 'Error'
        }
      });
      expect(logger.error).toHaveBeenCalledWith('Error manejado por errorHandler Something went wrong', expect.any(Object));
    });

    it('should handle errors with custom status code', () => {
      const error = new Error('Not Found');
      error.statusCode = 404;
      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Not Found',
          type: 'Error'
        }
      });
    });

    it('should handle errors with custom type and message', () => {
      const error = new Error('Invalid Input');
      error.statusCode = 400;
      error.type = 'ValidationError';
      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Invalid Input',
          type: 'ValidationError'
        }
      });
    });
  });

  describe('Headers Already Sent', () => {
    it('should call next if headers have already been sent', () => {
      const error = new Error('Headers already sent');
      res.headersSent = true;
      errorHandler(error, req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith('Error manejado por errorHandler Headers already sent', expect.any(Object));
    });
  });

  describe('Different Error Types', () => {
    it('should handle TypeError', () => {
      const error = new TypeError('Type error occurred');
      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Ocurrió un error interno en el servidor',
          type: 'TypeError'
        }
      });
    });

    it('should handle ReferenceError', () => {
      const error = new ReferenceError('Reference error occurred');
      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Ocurrió un error interno en el servidor',
          type: 'ReferenceError'
        }
      });
    });

    it('should handle SyntaxError', () => {
      const error = new SyntaxError('Syntax error occurred');
      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Ocurrió un error interno en el servidor',
          type: 'SyntaxError'
        }
      });
    });
  });

  describe('Error Logging', () => {
    it('should log error details', () => {
      const error = new Error('Test error');
      error.stack = 'Error stack trace';
      errorHandler(error, req, res, next);

      expect(logger.error).toHaveBeenCalledWith(
        'Error manejado por errorHandler Test error',
        expect.objectContaining({
          error: error,
          req: req,
          res: res
        })
      );
    });
  });
});
