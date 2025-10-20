const ParkingCellMapper = require('../../../src/core/services/mapping/parkingCellMapper');
const ParkingCell = require('../../../src/core/domain/parkingCell');
const ReservationDetails = require('../../../src/core/domain/reservationDetails');

describe('ParkingCellMapper', () => {
  describe('toDomain', () => {
    it('should map document to domain object', () => {
      const doc = {
        id: '507f1f77bcf86cd799439011',
        idStatic: 1,
        state: 'disponible',
        createdDate: new Date('2024-01-01T00:00:00Z'),
        createdBy: 'system',
        lastModifiedDate: new Date('2024-01-01T00:00:00Z'),
        lastModifiedBy: 'system',
        reservationDetails: null
      };

      const result = ParkingCellMapper.toDomain(doc);

      expect(result).toBeInstanceOf(ParkingCell);
      expect(result.id).toBe('507f1f77bcf86cd799439011');
      expect(result.idStatic).toBe(1);
      expect(result.state).toBe('disponible');
      expect(result.reservationDetails).toBeNull();
    });

    it('should map document with reservation details', () => {
      const doc = {
        id: '507f1f77bcf86cd799439011',
        idStatic: 1,
        state: 'reservado',
        createdDate: new Date('2024-01-01T00:00:00Z'),
        createdBy: 'system',
        lastModifiedDate: new Date('2024-01-01T00:00:00Z'),
        lastModifiedBy: 'system',
        reservationDetails: {
          reservedBy: 'user123',
          startTime: new Date('2024-01-01T10:00:00Z'),
          endTime: new Date('2024-01-01T12:00:00Z'),
          reason: 'Meeting'
        }
      };

      const result = ParkingCellMapper.toDomain(doc);

      expect(result).toBeInstanceOf(ParkingCell);
      expect(result.id).toBe('507f1f77bcf86cd799439011');
      expect(result.idStatic).toBe(1);
      expect(result.state).toBe('reservado');
      expect(result.reservationDetails).toBeInstanceOf(ReservationDetails);
      expect(result.reservationDetails.reservedBy).toBe('user123');
    });

    it('should handle invalid reservation details', () => {
      const doc = {
        id: '507f1f77bcf86cd799439011',
        idStatic: 1,
        state: 'reservado',
        createdDate: new Date('2024-01-01T00:00:00Z'),
        createdBy: 'system',
        lastModifiedDate: new Date('2024-01-01T00:00:00Z'),
        lastModifiedBy: 'system',
        reservationDetails: {
          // Missing required fields
          reservedBy: 'user123'
        }
      };

      expect(() => ParkingCellMapper.toDomain(doc)).toThrow('Error al crear ReservationDetails:');
    });
  });

  describe('toPersistence', () => {
    it('should map domain object to persistence format', () => {
      const entity = new ParkingCell({
        id: '507f1f77bcf86cd799439011',
        idStatic: 1,
        state: 'disponible',
        createdDate: new Date('2024-01-01T00:00:00Z'),
        createdBy: 'system',
        lastModifiedDate: new Date('2024-01-01T00:00:00Z'),
        lastModifiedBy: 'system',
        reservationDetails: null
      });

      const result = ParkingCellMapper.toPersistence(entity);

      expect(result).toEqual({
        idStatic: 1,
        state: 'disponible',
        createdDate: new Date('2024-01-01T00:00:00Z'),
        createdBy: 'system',
        lastModifiedDate: new Date('2024-01-01T00:00:00Z'),
        lastModifiedBy: 'system',
        reservationDetails: null
      });
    });

    it('should map domain object with reservation details', () => {
      const reservationDetails = new ReservationDetails({
        reservedBy: 'user123',
        startTime: new Date('2024-01-01T10:00:00Z'),
        endTime: new Date('2024-01-01T12:00:00Z'),
        reason: 'Meeting'
      });

      const entity = new ParkingCell({
        id: '507f1f77bcf86cd799439011',
        idStatic: 1,
        state: 'reservado',
        createdDate: new Date('2024-01-01T00:00:00Z'),
        createdBy: 'system',
        lastModifiedDate: new Date('2024-01-01T00:00:00Z'),
        lastModifiedBy: 'system',
        reservationDetails
      });

      const result = ParkingCellMapper.toPersistence(entity);

      expect(result).toEqual({
        idStatic: 1,
        state: 'reservado',
        createdDate: new Date('2024-01-01T00:00:00Z'),
        createdBy: 'system',
        lastModifiedDate: new Date('2024-01-01T00:00:00Z'),
        lastModifiedBy: 'system',
        reservationDetails: {
          reservedBy: 'user123',
          startTime: new Date('2024-01-01T10:00:00Z'),
          endTime: new Date('2024-01-01T12:00:00Z'),
          reason: 'Meeting'
        }
      });
    });
  });

  describe('toClient', () => {
    it('should map domain object to client format', () => {
      const entity = new ParkingCell({
        id: '507f1f77bcf86cd799439011',
        idStatic: 1,
        state: 'disponible',
        createdDate: new Date('2024-01-01T00:00:00Z'),
        lastModifiedDate: new Date('2024-01-01T00:00:00Z'),
        reservationDetails: null
      });

      const result = ParkingCellMapper.toClient(entity);

      expect(result).toEqual({
        id: '507f1f77bcf86cd799439011',
        idStatic: 1,
        state: 'disponible',
        reservationDetails: null,
        createdDate: new Date('2024-01-01T00:00:00Z'),
        lastModifiedDate: new Date('2024-01-01T00:00:00Z')
      });
    });

    it('should map domain object with reservation details to client format', () => {
      const reservationDetails = new ReservationDetails({
        reservedBy: 'user123',
        startTime: new Date('2024-01-01T10:00:00Z'),
        endTime: new Date('2024-01-01T12:00:00Z'),
        reason: 'Meeting'
      });

      const entity = new ParkingCell({
        id: '507f1f77bcf86cd799439011',
        idStatic: 1,
        state: 'reservado',
        createdDate: new Date('2024-01-01T00:00:00Z'),
        lastModifiedDate: new Date('2024-01-01T00:00:00Z'),
        reservationDetails
      });

      const result = ParkingCellMapper.toClient(entity);

      expect(result).toEqual({
        id: '507f1f77bcf86cd799439011',
        idStatic: 1,
        state: 'reservado',
        reservationDetails,
        createdDate: new Date('2024-01-01T00:00:00Z'),
        lastModifiedDate: new Date('2024-01-01T00:00:00Z')
      });
    });
  });
});