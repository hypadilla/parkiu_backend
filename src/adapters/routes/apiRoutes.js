const express = require('express');
const UserRoutes = require('./userRoutes');
const AuthRoutes = require('./authRoutes');
const RecommendationsRoutes = require('./recommendationsRoutes');
const ParkingCellRoutes = require('./parkingCellRoutes');
const DashboardRoutes = require('./dashboardRoutes');
const MobileRoutes = require('./mobileRoutes');

const router = express.Router();

module.exports = ({ authService, tokenBlacklist }) => {
    router.use(UserRoutes({ authService, tokenBlacklist }));
    router.use(AuthRoutes({ authService, tokenBlacklist }));
    router.use(RecommendationsRoutes({ authService, tokenBlacklist }));
    router.use(ParkingCellRoutes({ authService, tokenBlacklist }));
    router.use(DashboardRoutes({ authService, tokenBlacklist }));
    router.use(MobileRoutes()); // Sin autenticación para dispositivos móviles
    return router;
};
