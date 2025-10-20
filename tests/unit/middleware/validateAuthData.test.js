const validateAuthData = require('../../../src/adapters/middlewares/validation/validateAuthData');

describe('validateAuthData Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('Valid Data', () => {
    it('should pass validation with valid credentials', () => {
      req.body = {
        username: 'testuser',
        password: 'password123'
      };

      validateAuthData(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('Invalid Data', () => {
    it('should fail validation with missing username', () => {
      req.body = {
        password: 'password123'
      };

      validateAuthData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('username')
        })
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail validation with missing password', () => {
      req.body = {
        username: 'testuser'
      };

      validateAuthData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('password')
        })
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail validation with empty username', () => {
      req.body = {
        username: '',
        password: 'password123'
      };

      validateAuthData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('username')
        })
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail validation with empty password', () => {
      req.body = {
        username: 'testuser',
        password: ''
      };

      validateAuthData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('password')
        })
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});