const BaseDomainModel = require('./common/baseDomainModel');
const ReservationDetails = require('./reservationDetails');

class ParkingCell extends BaseDomainModel {
    constructor({
        id,
        idStatic, 
        createdDate,
        createdBy,
        lastModifiedDate,
        lastModifiedBy,
        state,
        reservationDetails = null,
    }) {
        super({ id, createdDate, createdBy, lastModifiedDate, lastModifiedBy });

        const validStates = ['disponible', 'ocupado', 'reservado', 'inhabilitado'];
        if (!validStates.includes(state)) {
            throw new Error(`El estado '${state}' no es válido. Debe ser uno de: ${validStates.join(', ')}`);
        }

        this.state = state;
        this.idStatic = idStatic;

        if (state === 'reservado') {
            if (!reservationDetails || !(reservationDetails instanceof ReservationDetails)) {
                throw new Error('reservationDetails es obligatorio y debe ser una instancia de ReservationDetails cuando el estado es "reservado".');
            }
            this.reservationDetails = reservationDetails;
        } else {
            if (reservationDetails && !(reservationDetails instanceof ReservationDetails)) {
                throw new Error(`reservationDetails debe ser null o una instancia válida cuando el estado es "${state}".`);
            }
            this.reservationDetails = null;
        }
    }
}

module.exports = ParkingCell;
