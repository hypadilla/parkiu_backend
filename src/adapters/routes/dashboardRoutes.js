const express = require('express');
const DashboardController = require('../controllers/dashboardController');
const ParkingCellRepository = require('../../infrastructure/repositories/parkingCellRepository');
const HistoricalRecordRepository = require('../../infrastructure/repositories/historicalRecordRepository');
const GetRecommendationsHandler = require('../../core/services/features/recommendations/queries/getRecommendations/getRecommendationsHandler');
const GetAllParkingCellHandler = require('../../core/services/features/parkingCell/queries/getAllParkingCell/getAllParkingCellHandler');
const GetParkingCellWithRecomendationsUseCase = require('../../core/usecases/getParkingCellWithRecomendationsUseCase');

module.exports = () => {
    const router = express.Router();

    const parkingCellRepository = new ParkingCellRepository();
    const historicalRecordRepository = new HistoricalRecordRepository();

    const getRecommendationsHandler = new GetRecommendationsHandler(historicalRecordRepository);
    const getAllParkingCellHandler = new GetAllParkingCellHandler(parkingCellRepository);

    const getParkingCellWithRecomendationsUseCase = new GetParkingCellWithRecomendationsUseCase(getAllParkingCellHandler, getRecommendationsHandler);

    const dashboardController = new DashboardController(getParkingCellWithRecomendationsUseCase);

    router.get('/dashboard', (req, res) => dashboardController.getDashboardData(req, res));

    return router;
};