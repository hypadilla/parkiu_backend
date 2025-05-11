const ReservationDetails = require('../../../../../domain/reservationDetails');

class UpsertParkingCellHandler {
    constructor(parkingCellRepository) {
        this.parkingCellRepository = parkingCellRepository;
    }

    async handle(command) {
        const { idStatic, state, reservationDetails = null } = command;

        const validStates = ['disponible', 'ocupado', 'reservado', 'inhabilitado'];
        if (!validStates.includes(state)) {
            throw new Error(`El estado '${state}' no es válido. Debe ser uno de: ${validStates.join(', ')}`);
        }

        let parsedReservationDetails = null;

        if (state === 'reservado') {
            if (!reservationDetails) {
                throw new Error('reservationDetails es requerido cuando el estado es "reservado".');
            }

            const { reservedBy, startTime, endTime, reason } = reservationDetails;

            if (!reservedBy || !startTime || !endTime) {
                throw new Error('Los campos reservedBy, startTime y endTime son obligatorios en reservationDetails.');
            }

            parsedReservationDetails = new ReservationDetails({
                reservedBy,
                startTime: startTime,
                endTime: endTime,
                reason: reason || null
            });
        }

        return await this.parkingCellRepository.upsertByStaticId(idStatic, state, parsedReservationDetails?.toPlainObject());
    }
}

module.exports = UpsertParkingCellHandler;
