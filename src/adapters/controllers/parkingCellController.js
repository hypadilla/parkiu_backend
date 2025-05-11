const BulkStatusUpdateCommand =require('../../core/services/features/parkingCell/command/bulkStatusUpdate/bulkStatusUpdateCommand');
const UpsertParkingCellCommand =require('../../core/services/features/parkingCell/command/upsertParkingCell/upsertParkingCellCommand');

const logger = require('../../core/utils/logger');

class ParkingCellController {
    constructor(bulkStatusWithHistoryUseCase, getAllParkingCellHandler, upsertParkingCellHandler) {
        this.bulkStatusWithHistoryUseCase = bulkStatusWithHistoryUseCase;
        this.getAllParkingCellHandler = getAllParkingCellHandler;
        this.upsertParkingCellHandler = upsertParkingCellHandler;
    }

    async bulkStatusUpdate(req, res) {
        try {
        const data = new BulkStatusUpdateCommand(req.body);
        await this.bulkStatusWithHistoryUseCase.execute(data);
        res.status(200).json({ message: "Bulk status updated successfully." });
        } catch (error) {
        console.error("Error in bulkStatusUpdate:", error);
        res.status(500).json({ error: "An error occurred while updating statuses." });
        }
    }

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { state, reservationDetails } = new UpsertParkingCellCommand(req.body);
            const command = new UpsertParkingCellCommand({
                idStatic: id,
                state,
                reservationDetails
            });
            await this.upsertParkingCellHandler.handle(command);
            res.status(200).json({ message: 'Estado actualizado' });
        } catch (error) {
            logger.error('Error actualizando estado de celda', { error: error.message });
            res.status(400).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const data = await this.getAllParkingCellHandler.handle();
            res.status(200).json(data);
        } catch (error) {
            logger.error('Error obteniendo celdas', { error: error.message });
            res.status(500).json({ error: 'Error interno' });
        }
    }
}

module.exports = ParkingCellController;
