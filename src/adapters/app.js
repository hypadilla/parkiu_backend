require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { createServer } = require('http');
const { swaggerUi, swaggerSpec } = require('../docs/swagger');

const logger = require('../core/utils/logger');
const errorHandler = require('./middlewares/errorHandler');
const mongoService = require('../infrastructure/database/mongoService');
const webSocketService = require('../infrastructure/websocket/websocketService');

const UserRepository = require("../infrastructure/repositories/userRepository");
const JwtAuthService = require("../infrastructure/services/jwtAuthService");
const TokenBlacklist = require("../infrastructure/utils/tokenBlacklist");

const app = express();
const server = createServer(app);

// Inicializar WebSocket
const io = webSocketService.initialize(server);

const userRepository = new UserRepository();
const authService = new JwtAuthService(process.env.JWT_SECRET || 'dev-secret', process.env.JWT_EXPIRES_IN || '1h', userRepository);
const tokenBlacklist = new TokenBlacklist();

const morganMiddleware = morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
});

app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
      : ['http://localhost:5173', 'http://localhost:4200', 'http://localhost:3001'];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('🚫 CORS bloqueado para origen:', origin);
      console.log('✅ Orígenes permitidos:', allowedOrigins);
      return callback(new Error('No permitido por CORS'), false);
    }
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const router = require('./routes/apiRoutes')({ authService, tokenBlacklist });
app.use('/api', router);

app.use(errorHandler);

app.use((err, req, res, next) => {
  logger.error('Unhandled Error', { message: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal Server Error' });
});

// Función para inicializar la aplicación
async function initializeApp() {
  try {
    // Conectar a MongoDB
    await mongoService.connect();
    
    // Iniciar servicios de tiempo real
    await webSocketService.startRealtimeServices();
    
    console.log('✅ Aplicación inicializada correctamente');
  } catch (error) {
    console.error('❌ Error inicializando aplicación:', error);
    process.exit(1);
  }
}

// Función para cerrar la aplicación
async function closeApp() {
  try {
    await webSocketService.stopRealtimeServices();
    await mongoService.disconnect();
    console.log('✅ Aplicación cerrada correctamente');
  } catch (error) {
    console.error('❌ Error cerrando aplicación:', error);
  }
}

// Manejar cierre graceful
process.on('SIGINT', closeApp);
process.on('SIGTERM', closeApp);

module.exports = { app, server, initializeApp, closeApp };
