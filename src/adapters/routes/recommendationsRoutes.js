const express = require('express');
const { authMiddleware } = require('../middlewares/auth/authMiddleware');
const requirePermission = require('../middlewares/auth/requirePermission');
const { PERMISSIONS } = require('../../config/permissions');
const RecommendationController = require('../controllers/recommendationsController');
const HistoricalRecordRepository = require('../../infrastructure/repositories/historicalRecordRepository');

const GetRecommendationsHandler = require('../../core/services/features/recommendations/queries/getRecommendations/getRecommendationsHandler');
const CreateRecommendationsHandler = require('../../core/services/features/recommendations/command/createHistoricalRecord/createHistoricalRecordHandler');

module.exports = ({ authService, tokenBlacklist }) => {
    const router = express.Router();

    const historicalRecordRepository = new HistoricalRecordRepository();
    const getRecommendationsHandler = new GetRecommendationsHandler(historicalRecordRepository);
    const createRecommendationsHandler = new CreateRecommendationsHandler(historicalRecordRepository);
    const recommendationController = new RecommendationController(
        getRecommendationsHandler,
        createRecommendationsHandler
    );

    router.get('/recommendations', authMiddleware(authService, tokenBlacklist), requirePermission(PERMISSIONS.CAN_VIEW_RECOMMENDATIONS), (req, res) => recommendationController.getRecommendations(req, res));
    router.post('/recommendations', authMiddleware(authService, tokenBlacklist), requirePermission(PERMISSIONS.CAN_MANAGE_SYSTEM), (req, res) => recommendationController.createRecommendations(req, res));
    return router;
};
