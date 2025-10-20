const ParkingCellMapper = require('../../../src/core/services/mapping/parkingCellMapper');
const ParkingCell = require('../../../src/core/domain/parkingCell');
const ReservationDetails = require('../../../src/core/domain/reservationDetails');

describe('ParkingCellMapper', () => {
  describe('toDomain', () => {
    it('should map document to domain object', () => {
      const document = {
        id: 'cell1',
        idStatic: 1,
        state: 'disponible',
        reservationDetails: null,
        createdDate: new Date('2023-01-01'),
        createdBy: 'system',
        lastModifiedDate: new Date('2023-01-02'),
        lastModifiedBy: 'user'
      };

      const cell = ParkingCellMapper.toDomain(document);

      expect(cell).toBeInstanceOf(ParkingCell);
      expect(cell.id).toBe('cell1');
      expect(cell.idStatic).toBe(1);
      expect(cell.state).toBe('disponible');
      expect(cell.reservationDetails).toBeNull();
    });

    it('should map document with reservation details', () => {
      const document = {
        id: 'cell2',
        idStatic: 2,
        state: 'reservado',
        reservationDetails: {
          reservedBy: 'user123',
          startTime: '2023-01-01T10:00:00Z',
          endTime: '2023-01-01T11:00:00Z',
          reason: 'Meeting'
        }
      };

      const cell = ParkingCellMapper.toDomain(document);

      expect(cell).toBeInstanceOf(ParkingCell);
      expect(cell.id).toBe('cell2');
      expect(cell.idStatic).toBe(2);
      expect(cell.state).toBe('reservado');
      expect(cell.reservationDetails).toBeInstanceOf(ReservationDetails);
    });

    it('should handle null input', () => {
      const result = ParkingCellMapper.toDomain(null);
      expect(result).toBeNull();
    });

    it('should handle undefined input', () => {
      const result = ParkingCellMapper.toDomain(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('toPersistence', () => {
    it('should map domain object to persistence format', () => {
      const cell = new ParkingCell({
        id: 'cell1',
        idStatic: 1,
        state: 'disponible',
        reservationDetails: null,
        createdDate: new Date('2023-01-01'),
        createdBy: 'system',
        lastModifiedDate: new Date('2023-01-02'),
        lastModifiedBy: 'user'
      });

      const persistenceData = ParkingCellMapper.toPersistence(cell);

      expect(persistenceData).toEqual({
        createdDate: cell.createdDate,
        createdBy: 'system',
        lastModifiedDate: cell.lastModifiedDate,
        lastModifiedBy: 'user',
        idStatic: 1,
        state: 'disponible',
        reservationDetails: null
      });
    });

    it('should map domain object with reservation details', () => {
      const reservationDetails = new ReservationDetails({
        reservedBy: 'user123',
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T11:00:00Z',
        reason: 'Meeting'
      });

      const cell = new ParkingCell({
        id: 'cell2',
        idStatic: 2,
        state: 'reservado',
        reservationDetails: reservationDetails
      });

      const persistenceData = ParkingCellMapper.toPersistence(cell);

      expect(persistenceData).toEqual({
        createdDate: cell.createdDate,
        createdBy: undefined,
        lastModifiedDate: cell.lastModifiedDate,
        lastModifiedBy: undefined,
        idStatic: 2,
        state: 'reservado',
        reservationDetails: expect.objectContaining({
          reservedBy: 'user123',
          reason: 'Meeting'
        })
      });
    });
  });

  describe('toClient', () => {
    it('should map domain object to client format', () => {
      const cell = new ParkingCell({
        id: 'cell1',
        idStatic: 1,
        state: 'disponible',
        reservationDetails: null
      });

      const clientData = ParkingCellMapper.toClient(cell);

      expect(clientData).toEqual({
        id: 'cell1',
        idStatic: 1,
        state: 'disponible',
        reservationDetails: null,
        createdDate: expect.any(Date),
        lastModifiedDate: expect.any(Date)
      });
    });

    it('should map domain object with reservation details', () => {
      const reservationDetails = new ReservationDetails({
        reservedBy: 'user123',
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T11:00:00Z',
        reason: 'Meeting'
      });

      const cell = new ParkingCell({
        id: 'cell2',
        idStatic: 2,
        state: 'reservado',
        reservationDetails: reservationDetails
      });

      const clientData = ParkingCellMapper.toClient(cell);

      expect(clientData).toEqual({
        id: 'cell2',
        idStatic: 2,
        state: 'reservado',
        reservationDetails: expect.objectContaining({
          reservedBy: 'user123',
          reason: 'Meeting'
        }),
        createdDate: expect.any(Date),
        lastModifiedDate: expect.any(Date)
      });
    });

    it('should handle null input', () => {
      const result = ParkingCellMapper.toClient(null);
      expect(result).toBeNull();
    });

    it('should handle undefined input', () => {
      const result = ParkingCellMapper.toClient(undefined);
      expect(result).toBeUndefined();
    });
  });
});
