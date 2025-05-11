const express = require('express');
const UserRoutes = require('./userRoutes');
const AuthRoutes = require('./authRoutes');
const RecommendationsRoutes = require('./recommendationsRoutes');
const ParkingCellRoutes = require('./parkingCellRoutes');
const DashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

module.exports = ({ authService, tokenBlacklist }) => {
    router.use(UserRoutes({ authService, tokenBlacklist }));
    router.use(AuthRoutes({ authService, tokenBlacklist }));
    router.use(RecommendationsRoutes());
    router.use(ParkingCellRoutes({ authService, tokenBlacklist }));
    router.use(DashboardRoutes());
    return router;
};
