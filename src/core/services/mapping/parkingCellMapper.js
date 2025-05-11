const ParkingCell = require('../../domain/parkingCell');
const ReservationDetails = require('../../domain/reservationDetails');

class ParkingCellMapper {
    static toDomain(doc) {
        console.log('doc.reservationDetails:', doc.reservationDetails);
        let reservationDetails = null;

        if (doc.reservationDetails) {
            try {
                reservationDetails = new ReservationDetails(doc.reservationDetails);
            } catch (error) {
                throw new Error(`Error al crear ReservationDetails: ${error.message}`);
            }
        }

        return new ParkingCell({
            id: doc.id,
            idStatic: doc.idStatic,
            createdDate: doc.createdDate,
            createdBy: doc.createdBy,
            lastModifiedDate: doc.lastModifiedDate,
            lastModifiedBy: doc.lastModifiedBy,
            state: doc.state,
            reservationDetails
        });
    }

    static toPersistence(entity) {
        return {
            idStatic: entity.idStatic,
            createdDate: entity.createdDate,
            createdBy: entity.createdBy,
            lastModifiedDate: entity.lastModifiedDate,
            lastModifiedBy: entity.lastModifiedBy,
            state: entity.state,
            reservationDetails: entity.reservationDetails
                ? {
                    reservedBy: entity.reservationDetails.reservedBy,
                    startTime: entity.reservationDetails.startTime,
                    endTime: entity.reservationDetails.endTime,
                    reason: entity.reservationDetails.reason
                }
                : null
        };
    }

    static toClient(entity) {
        const { id, idStatic, state, reservationDetails, createdDate, lastModifiedDate } = entity;
        return {
            id,
            idStatic,
            state,
            reservationDetails,
            createdDate,
            lastModifiedDate
        };
    }
}

module.exports = ParkingCellMapper;
