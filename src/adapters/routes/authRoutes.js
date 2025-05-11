const express = require("express");
const validateLogin = require('../middlewares/auth/login');
const { authMiddleware } = require('../middlewares/auth/authMiddleware');
const AuthController = require("../controllers/authController");

const AuthenticateUserHandler = require("../../core/services/features/auth/command/authenticateUser/authenticateUserHandler");
const LogoutUserHandler = require("../../core/services/features/auth/command/logoutUser/logoutUserHandler");
const VerifyTokenHandler = require("../../core/services/features/auth/command/verifyToken/verifyTokenHandler");
const RefreshTokenHandler = require("../../core/services/features/auth/command/refreshToken/refreshTokenHandler");


module.exports = ({ authService, tokenBlacklist }) => {
    const router = express.Router();

    const authenticateUserHandler = new AuthenticateUserHandler(authService);
    const logoutUserHandler = new LogoutUserHandler(tokenBlacklist);
    const verifyTokenHandler = new VerifyTokenHandler(authService);
    const refreshTokenHandler = new RefreshTokenHandler();

    const authController = new AuthController(
        authenticateUserHandler,
        logoutUserHandler,
        verifyTokenHandler,
        refreshTokenHandler
    );

    router.post('/auth/login', validateLogin, (req, res) => authController.login(req, res));
    router.post('/auth/logout', authMiddleware(authService, tokenBlacklist), (req, res) => authController.logout(req, res));
    router.post('/auth/verify-token', authController.verifyToken.bind(authController));
    router.post('/auth/refresh-token', authController.refreshToken.bind(authController));

    return router;
};
