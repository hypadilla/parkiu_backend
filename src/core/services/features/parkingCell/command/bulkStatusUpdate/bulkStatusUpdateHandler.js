const ParkingCell = require('../../../../../domain/parkingCell');

class BulkStatusUpdateHandler {
    constructor(parkingCellRepository) {
        this.parkingCellRepository = parkingCellRepository;
    }

    async handle(data) {
        const sectores = data.data.sectores;
        const cells = [];

        for (const sector of sectores) {
            const { celdas } = sector;
            for (const [id, value] of Object.entries(celdas)) {
                cells.push({
                    idStatic: parseInt(id),
                    state: value
                });
            }
        }

        await this.parkingCellRepository.bulkStatusUpdate(cells);
    }
}

module.exports = BulkStatusUpdateHandler;
