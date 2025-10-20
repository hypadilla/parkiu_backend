const validateUserData = require('../../../src/adapters/middlewares/validation/validateUserData');

describe('validateUserData Middleware', () => {
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
    it('should pass validation with all required fields', () => {
      req.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test',
        lastName: 'User',
        role: 'USER'
      };

      validateUserData(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should pass validation with minimal required fields', () => {
      req.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      validateUserData(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('Invalid Data', () => {
    it('should fail validation with missing username', () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      validateUserData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('username')
        })
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail validation with missing email', () => {
      req.body = {
        username: 'testuser',
        password: 'password123'
      };

      validateUserData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('email')
        })
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail validation with missing password', () => {
      req.body = {
        username: 'testuser',
        email: 'test@example.com'
      };

      validateUserData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('password')
        })
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid email format', () => {
      req.body = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      };

      validateUserData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('email')
        })
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail validation with short password', () => {
      req.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123'
      };

      validateUserData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('password')
        })
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid role', () => {
      req.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'INVALID_ROLE'
      };

      validateUserData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('role')
        })
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
