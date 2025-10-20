const ReservationDetails = require('../../../src/core/domain/reservationDetails');

describe('ReservationDetails Domain Model', () => {
  describe('Constructor', () => {
    it('should create reservation details with all properties', () => {
      const detailsData = {
        reservedBy: 'user123',
        startTime: new Date('2023-01-01T10:00:00Z'),
        endTime: new Date('2023-01-01T11:00:00Z'),
        reason: 'Important meeting'
      };

      const details = new ReservationDetails(detailsData);

      expect(details.reservedBy).toBe('user123');
      expect(details.startTime).toEqual(new Date('2023-01-01T10:00:00Z'));
      expect(details.endTime).toEqual(new Date('2023-01-01T11:00:00Z'));
      expect(details.reason).toBe('Important meeting');
    });

    it('should create reservation details with string dates', () => {
      const detailsData = {
        reservedBy: 'user456',
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T11:00:00Z',
        reason: 'Client visit'
      };

      const details = new ReservationDetails(detailsData);

      expect(details.reservedBy).toBe('user456');
      expect(details.startTime).toEqual(new Date('2023-01-01T10:00:00Z'));
      expect(details.endTime).toEqual(new Date('2023-01-01T11:00:00Z'));
      expect(details.reason).toBe('Client visit');
    });

    it('should throw error for missing reservedBy', () => {
      const detailsData = {
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T11:00:00Z',
        reason: 'Meeting'
      };

      expect(() => {
        new ReservationDetails(detailsData);
      }).toThrow('reservedBy es obligatorio y debe ser un string.');
    });

    it('should throw error for empty reservedBy', () => {
      const detailsData = {
        reservedBy: '',
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T11:00:00Z',
        reason: 'Meeting'
      };

      expect(() => {
        new ReservationDetails(detailsData);
      }).toThrow('reservedBy es obligatorio y debe ser un string.');
    });

    it('should throw error for invalid startTime', () => {
      const detailsData = {
        reservedBy: 'user123',
        startTime: 'invalid-date',
        endTime: '2023-01-01T11:00:00Z',
        reason: 'Meeting'
      };

      expect(() => {
        new ReservationDetails(detailsData);
      }).toThrow('startTime debe ser una fecha válida.');
    });

    it('should throw error for invalid endTime', () => {
      const detailsData = {
        reservedBy: 'user123',
        startTime: '2023-01-01T10:00:00Z',
        endTime: 'invalid-date',
        reason: 'Meeting'
      };

      expect(() => {
        new ReservationDetails(detailsData);
      }).toThrow('endTime debe ser una fecha válida.');
    });

    it('should throw error when endTime is before startTime', () => {
      const detailsData = {
        reservedBy: 'user123',
        startTime: '2023-01-01T12:00:00Z',
        endTime: '2023-01-01T10:00:00Z',
        reason: 'Meeting'
      };

      expect(() => {
        new ReservationDetails(detailsData);
      }).toThrow('endTime debe ser posterior a startTime.');
    });

    it('should throw error for missing reason', () => {
      const detailsData = {
        reservedBy: 'user123',
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T11:00:00Z'
      };

      expect(() => {
        new ReservationDetails(detailsData);
      }).toThrow('reason es obligatorio y debe ser un string.');
    });

    it('should throw error for empty reason', () => {
      const detailsData = {
        reservedBy: 'user123',
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T11:00:00Z',
        reason: ''
      };

      expect(() => {
        new ReservationDetails(detailsData);
      }).toThrow('reason es obligatorio y debe ser un string.');
    });
  });

  describe('toPlainObject', () => {
    it('should return plain object with all properties', () => {
      const detailsData = {
        reservedBy: 'user123',
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T11:00:00Z',
        reason: 'Important meeting'
      };

      const details = new ReservationDetails(detailsData);
      const plainObject = details.toPlainObject();

      expect(plainObject).toEqual({
        reservedBy: 'user123',
        startTime: new Date('2023-01-01T10:00:00Z'),
        endTime: new Date('2023-01-01T11:00:00Z'),
        reason: 'Important meeting'
      });
    });
  });
});
