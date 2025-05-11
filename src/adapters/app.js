const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { swaggerUi, swaggerSpec } = require('../docs/swagger');

const logger = require('../core/utils/logger');
const errorHandler = require('./middlewares/errorHandler');

const UserRepository = require("../infrastructure/repositories/userRepository");
const JwtAuthService = require("../infrastructure/services/jwtAuthService");
const TokenBlacklist = require("../infrastructure/utils/tokenBlacklist");

const app = express();

const userRepository = new UserRepository();
const authService = new JwtAuthService('your-secret-key', '1h', userRepository);
const tokenBlacklist = new TokenBlacklist();

const morganMiddleware = morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
});

app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
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

module.exports = app;
