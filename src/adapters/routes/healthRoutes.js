const express = require('express');

module.exports = () => {
    const router = express.Router();

    // Endpoint de healthcheck público
    router.get('/health', (req, res) => {
        res.status(200).json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'parkiu-backend',
            version: '1.0.0'
        });
    });

    // Endpoint de healthcheck detallado (requiere autenticación)
    router.get('/health/detailed', (req, res) => {
        const mongoService = require('../../infrastructure/database/mongoService');
        const changeStreamService = require('../../infrastructure/websocket/changeStreamService');
        
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'parkiu-backend',
            version: '1.0.0',
            database: {
                connected: mongoService.isConnected,
                status: mongoService.isConnected ? 'connected' : 'disconnected'
            },
            websocket: {
                changeStreams: changeStreamService.getChangeStreamStatus(),
                mode: Object.keys(changeStreamService.getChangeStreamStatus()).length > 0 ? 'changeStreams' : 'polling'
            }
        };

        res.status(200).json(health);
    });

    return router;
};
