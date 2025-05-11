const express = require('express');
const { authMiddleware } = require('../middlewares/auth/authMiddleware');
const requirePermission = require('../middlewares/auth/requirePermission');
const ParkingCellController = require('../controllers/parkingCellController');
const ParkingCellRepository = require('../../infrastructure/repositories/parkingCellRepository');
const HistoricalRecordRepository = require('../../infrastructure/repositories/historicalRecordRepository');
const BulkStatusWithHistoryUseCase = require('../../core/usecases/bulkStatusWithHistoryUseCase');
const GetAllParkingCellHandler = require('../../core/services/features/parkingCell/queries/getAllParkingCell/getAllParkingCellHandler');
const UpsertParkingCellHandler = require('../../core/services/features/parkingCell/command/upsertParkingCell/upsertParkingCellHandler');

module.exports = ({ authService, tokenBlacklist }) => {
    const router = express.Router();
    const parkingCellRepository = new ParkingCellRepository();
    const historicalRecordRepository = new HistoricalRecordRepository();
    const bulkStatusWithHistoryUseCase = new BulkStatusWithHistoryUseCase(parkingCellRepository, historicalRecordRepository);
    const getAllParkingCellHandler = new GetAllParkingCellHandler(parkingCellRepository);
    const upsertParkingCell = new UpsertParkingCellHandler(parkingCellRepository);
    

    const controller = new ParkingCellController(bulkStatusWithHistoryUseCase, getAllParkingCellHandler, upsertParkingCell);

    router.post('/parking-cells/bulk-status', (req, res) => controller.bulkStatusUpdate(req, res));
    router.get('/parking-cells', (req, res) => controller.getAll(req, res));
    router.put('/parking-cells/:id/status', authMiddleware(authService, tokenBlacklist), requirePermission('CAN_CREATE_RESERVATION'), (req, res) => controller.updateStatus(req, res));

    return router;
};