const validateParkingCellData = require('../../../src/adapters/middlewares/validation/validateParkingCellData');

describe('validateParkingCellData Middleware', () => {
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
    it('should pass validation with available state', () => {
      req.body = {
        state: 'disponible',
        reservationDetails: null
      };

      validateParkingCellData(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should pass validation with occupied state', () => {
      req.body = {
        state: 'ocupado',
        reservationDetails: null
      };

      validateParkingCellData(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should pass validation with reserved state and valid reservation details', () => {
      req.body = {
        state: 'reservado',
        reservationDetails: {
          reservedBy: 'user123',
          startTime: '2023-01-01T10:00:00Z',
          endTime: '2023-01-01T11:00:00Z',
          reason: 'Meeting'
        }
      };

      validateParkingCellData(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should pass validation with disabled state', () => {
      req.body = {
        state: 'inhabilitado',
        reservationDetails: null
      };

      validateParkingCellData(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('Invalid Data', () => {
    it('should fail validation with invalid state', () => {
      req.body = {
        state: 'invalid_state',
        reservationDetails: null
      };

      validateParkingCellData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('state')
        })
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail validation with missing state', () => {
      req.body = {
        reservationDetails: null
      };

      validateParkingCellData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('state')
        })
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail validation with reserved state but missing reservation details', () => {
      req.body = {
        state: 'reservado',
        reservationDetails: null
      };

      validateParkingCellData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('reservationDetails')
        })
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail validation with reserved state but invalid reservation details', () => {
      req.body = {
        state: 'reservado',
        reservationDetails: {
          reservedBy: 'user123'
          // Missing required fields
        }
      };

      validateParkingCellData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('reservationDetails')
        })
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid date format in reservation', () => {
      req.body = {
        state: 'reservado',
        reservationDetails: {
          reservedBy: 'user123',
          startTime: 'invalid-date',
          endTime: '2023-01-01T11:00:00Z',
          reason: 'Meeting'
        }
      };

      validateParkingCellData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('reservationDetails')
        })
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});