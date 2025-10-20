const express = require('express');
const ParkingCellController = require('../controllers/parkingCellController');
const ParkingCellRepository = require('../../infrastructure/repositories/parkingCellRepository');
const HistoricalRecordRepository = require('../../infrastructure/repositories/historicalRecordRepository');
const BulkStatusWithHistoryUseCase = require('../../core/usecases/bulkStatusWithHistoryUseCase');
const GetAllParkingCellHandler = require('../../core/services/features/parkingCell/queries/getAllParkingCell/getAllParkingCellHandler');
const UpsertParkingCellHandler = require('../../core/services/features/parkingCell/command/upsertParkingCell/upsertParkingCellHandler');

module.exports = () => {
    const router = express.Router();

    const parkingCellRepository = new ParkingCellRepository();
    const historicalRecordRepository = new HistoricalRecordRepository();
    const bulkStatusWithHistoryUseCase = new BulkStatusWithHistoryUseCase(parkingCellRepository, historicalRecordRepository);
    const getAllParkingCellHandler = new GetAllParkingCellHandler(parkingCellRepository);
    const upsertParkingCell = new UpsertParkingCellHandler(parkingCellRepository);

    const controller = new ParkingCellController(bulkStatusWithHistoryUseCase, getAllParkingCellHandler, upsertParkingCell);

    // Endpoints para dispositivos móviles sin autenticación
    // Solo permiten operaciones básicas de lectura y actualización de estado
    router.get('/mobile/parking-cells', (req, res) => controller.getAll(req, res));
    router.post('/mobile/parking-cells/bulk-status', (req, res) => controller.bulkStatusUpdate(req, res));
    router.put('/mobile/parking-cells/:id/status', (req, res) => controller.updateStatus(req, res));

    return router;
};
