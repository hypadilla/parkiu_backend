const ParkingCellMapper = require('../../../../../services/mapping/parkingCellMapper');

class GetAllParkingCellHandler {
    constructor(parkingCellRepository) {
        this.parkingCellRepository = parkingCellRepository;
    }

    async handle() {
        const parkingCells = await this.parkingCellRepository.getAll();

        const sortedCells = parkingCells.sort((a, b) => a.idStatic - b.idStatic);

        return sortedCells.map(cell => ParkingCellMapper.toClient(cell));
    }
}

module.exports = GetAllParkingCellHandler;
