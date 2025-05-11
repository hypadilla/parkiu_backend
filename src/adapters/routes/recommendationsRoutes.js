const express = require('express');
const RecommendationController = require('../controllers/recommendationsController');
const HistoricalRecordRepository = require('../../infrastructure/repositories/historicalRecordRepository');

const GetRecommendationsHandler = require('../../core/services/features/recommendations/queries/getRecommendations/getRecommendationsHandler');
const CreateRecommendationsHandler = require('../../core/services/features/recommendations/command/createHistoricalRecord/createHistoricalRecordHandler');

module.exports = () => {
    const router = express.Router();

    const historicalRecordRepository = new HistoricalRecordRepository();
    const getRecommendationsHandler = new GetRecommendationsHandler(historicalRecordRepository);
    const createRecommendationsHandler = new CreateRecommendationsHandler(historicalRecordRepository);
    const recommendationController = new RecommendationController(
        getRecommendationsHandler,
        createRecommendationsHandler
    );

    router.get('/recommendations', (req, res) => recommendationController.getRecommendations(req, res));
    router.post('/recommendations', (req, res) => recommendationController.createRecommendations(req, res));
    return router;
};
