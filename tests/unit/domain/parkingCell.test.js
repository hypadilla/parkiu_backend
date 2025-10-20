const ParkingCell = require('../../../src/core/domain/parkingCell');
const ReservationDetails = require('../../../src/core/domain/reservationDetails');

describe('ParkingCell Domain Model', () => {
  describe('Constructor', () => {
    it('should create parking cell with available state', () => {
      const cellData = {
        id: 'cell1',
        idStatic: 1,
        state: 'disponible',
        reservationDetails: null
      };

      const cell = new ParkingCell(cellData);

      expect(cell.id).toBe('cell1');
      expect(cell.idStatic).toBe(1);
      expect(cell.state).toBe('disponible');
      expect(cell.reservationDetails).toBeNull();
    });

    it('should create parking cell with occupied state', () => {
      const cellData = {
        id: 'cell2',
        idStatic: 2,
        state: 'ocupado',
        reservationDetails: null
      };

      const cell = new ParkingCell(cellData);

      expect(cell.id).toBe('cell2');
      expect(cell.idStatic).toBe(2);
      expect(cell.state).toBe('ocupado');
      expect(cell.reservationDetails).toBeNull();
    });

    it('should create parking cell with reserved state and valid reservation details', () => {
      const reservationDetails = new ReservationDetails({
        reservedBy: 'user123',
        startTime: new Date('2023-01-01T10:00:00Z'),
        endTime: new Date('2023-01-01T11:00:00Z'),
        reason: 'Meeting'
      });

      const cellData = {
        id: 'cell3',
        idStatic: 3,
        state: 'reservado',
        reservationDetails: reservationDetails
      };

      const cell = new ParkingCell(cellData);

      expect(cell.id).toBe('cell3');
      expect(cell.idStatic).toBe(3);
      expect(cell.state).toBe('reservado');
      expect(cell.reservationDetails).toBeInstanceOf(ReservationDetails);
      expect(cell.reservationDetails.reservedBy).toBe('user123');
    });

    it('should throw error for reserved state without reservation details', () => {
      const cellData = {
        id: 'cell4',
        idStatic: 4,
        state: 'reservado',
        reservationDetails: null
      };

      expect(() => {
        new ParkingCell(cellData);
      }).toThrow('reservationDetails es obligatorio y debe ser una instancia de ReservationDetails cuando el estado es "reservado".');
    });

    it('should throw error for reserved state with invalid reservation details', () => {
      const cellData = {
        id: 'cell5',
        idStatic: 5,
        state: 'reservado',
        reservationDetails: { invalid: 'object' }
      };

      expect(() => {
        new ParkingCell(cellData);
      }).toThrow('reservationDetails es obligatorio y debe ser una instancia de ReservationDetails cuando el estado es "reservado".');
    });

    it('should set default dates when not provided', () => {
      const cellData = {
        id: 'cell6',
        idStatic: 6,
        state: 'disponible'
      };

      const cell = new ParkingCell(cellData);

      expect(cell.createdDate).toBeInstanceOf(Date);
      expect(cell.lastModifiedDate).toBeInstanceOf(Date);
    });
  });

  describe('toPlainObject', () => {
    it('should return plain object with all properties', () => {
      const cellData = {
        id: 'cell1',
        idStatic: 1,
        state: 'disponible',
        reservationDetails: null
      };

      const cell = new ParkingCell(cellData);
      const plainObject = cell.toPlainObject();

      expect(plainObject).toEqual({
        id: 'cell1',
        idStatic: 1,
        state: 'disponible',
        reservationDetails: null,
        createdDate: expect.any(Date),
        lastModifiedDate: expect.any(Date)
      });
    });

    it('should return plain object with reservation details', () => {
      const reservationDetails = new ReservationDetails({
        reservedBy: 'user123',
        startTime: new Date('2023-01-01T10:00:00Z'),
        endTime: new Date('2023-01-01T11:00:00Z'),
        reason: 'Meeting'
      });

      const cellData = {
        id: 'cell2',
        idStatic: 2,
        state: 'reservado',
        reservationDetails: reservationDetails
      };

      const cell = new ParkingCell(cellData);
      const plainObject = cell.toPlainObject();

      expect(plainObject).toEqual({
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
  });
});
