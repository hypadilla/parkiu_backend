class ReservationDetails {
    constructor({ reservedBy, startTime, endTime, reason }) {
        if (!reservedBy || typeof reservedBy !== 'string') {
            throw new Error('reservedBy es obligatorio y debe ser un string.');
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (isNaN(start.getTime())) {
            throw new Error('startTime debe ser una fecha válida.');
        }

        if (isNaN(end.getTime())) {
            throw new Error('endTime debe ser una fecha válida.');
        }

        if (start >= end) {
            throw new Error('endTime debe ser posterior a startTime.');
        }

        if (!reason || typeof reason !== 'string') {
            throw new Error('reason es obligatorio y debe ser un string.');
        }

        this.reservedBy = reservedBy;
        this.startTime = start;
        this.endTime = end;
        this.reason = reason;
    }

    toPlainObject() {
        return {
            reservedBy: this.reservedBy,
            startTime: this.startTime,
            endTime: this.endTime,
            reason: this.reason
        };
    }
}

module.exports = ReservationDetails;
