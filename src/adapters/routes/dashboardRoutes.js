const express = require('express');
const { authMiddleware } = require('../middlewares/auth/authMiddleware');
const requirePermission = require('../middlewares/auth/requirePermission');
const { PERMISSIONS } = require('../../config/permissions');
const DashboardController = require('../controllers/dashboardController');
const ParkingCellRepository = require('../../infrastructure/repositories/parkingCellRepository');
const HistoricalRecordRepository = require('../../infrastructure/repositories/historicalRecordRepository');
const GetRecommendationsHandler = require('../../core/services/features/recommendations/queries/getRecommendations/getRecommendationsHandler');
const GetAllParkingCellHandler = require('../../core/services/features/parkingCell/queries/getAllParkingCell/getAllParkingCellHandler');
const GetParkingCellWithRecomendationsUseCase = require('../../core/usecases/getParkingCellWithRecomendationsUseCase');

module.exports = ({ authService, tokenBlacklist }) => {
    const router = express.Router();

    const parkingCellRepository = new ParkingCellRepository();
    const historicalRecordRepository = new HistoricalRecordRepository();

    const getRecommendationsHandler = new GetRecommendationsHandler(historicalRecordRepository);
    const getAllParkingCellHandler = new GetAllParkingCellHandler(parkingCellRepository);

    const getParkingCellWithRecomendationsUseCase = new GetParkingCellWithRecomendationsUseCase(getAllParkingCellHandler, getRecommendationsHandler);

    const dashboardController = new DashboardController(getParkingCellWithRecomendationsUseCase);

    router.get('/dashboard', authMiddleware(authService, tokenBlacklist), requirePermission(PERMISSIONS.CAN_VIEW_DASHBOARD), (req, res) => dashboardController.getDashboardData(req, res));

    return router;
};