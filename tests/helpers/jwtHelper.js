const jwt = require('jsonwebtoken');

// Helper para generar tokens JWT válidos en tests
const generateTestToken = (payload = {}) => {
  const defaultPayload = {
    userId: 'test-user-id',
    username: 'testuser',
    role: 'admin',
    permissions: ['CAN_VIEW_USERS', 'CAN_CREATE_USERS', 'CAN_UPDATE_USERS', 'CAN_DELETE_USERS']
  };
  
  const finalPayload = { ...defaultPayload, ...payload };
  
  // Usar el mismo secret hardcodeado que utiliza el servidor en app.js
  const secret = 'your-secret-key';
  
  return jwt.sign(finalPayload, secret, { expiresIn: '1h' });
};

module.exports = {
  generateTestToken
};
