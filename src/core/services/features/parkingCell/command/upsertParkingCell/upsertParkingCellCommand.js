class UpsertParkingCellCommand {
    constructor({ idStatic, state, reservationDetails = null }) {
        this.idStatic = idStatic;
        this.state = state;
        this.reservationDetails = reservationDetails;
    }
}

module.exports = UpsertParkingCellCommand;
