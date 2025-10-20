const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logger = require('../../core/utils/logger');

// Clave secreta para firmar los tokens JWT (en producción, esto debería estar en variables de entorno)
const JWT_SECRET = 'parkiu-mock-secret-key';

// Usuario de prueba
const mockUsers = [
  {
    id: '1',
    username: 'admin1',
    password: '$2b$10$XFtx0bOG1SxmvQhVP4qwXeKxz7GBzYw0PtZsGokRfk/PPTJNi3k7e', // hash de 'admin123'
    email: 'admin@parkiu.com',
    name: 'Administrador',
    lastName: 'Sistema',
    role: 'ADMIN',
    permissions: [
      'CAN_CREATE_USERS',
      'CAN_UPDATE_USERS',
      'CAN_DELETE_USERS',
      'CAN_VIEW_USERS'
    ]
  },
  {
    id: '2',
    username: 'user1',
    password: '$2b$10$XFtx0bOG1SxmvQhVP4qwXeKxz7GBzYw0PtZsGokRfk/PPTJNi3k7e', // hash de 'admin123'
    email: 'user@parkiu.com',
    name: 'Usuario',
    lastName: 'Normal',
    role: 'USER',
    permissions: [
      'CAN_VIEW_USERS'
    ]
  }
];

// Lista negra de tokens (para logout)
const tokenBlacklist = new Set();

class MockAuthService {
  async authenticate({ username, password }) {
    logger.info('Autenticando usuario con mock service', { username });
    
    try {
      // Buscar usuario por username
      const user = mockUsers.find(u => u.username === username);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      
      // Verificar contraseña
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        throw new Error('Contraseña incorrecta');
      }
      
      // Generar token JWT
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          lastName: user.lastName,
          role: user.role,
          permissions: user.permissions
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return {
        user,
        token
      };
    } catch (error) {
      logger.error('Error en autenticación mock', { error: error.message });
      throw error;
    }
  }
  
  async verifyToken(token) {
    try {
      // Verificar si el token está en la lista negra
      if (tokenBlacklist.has(token)) {
        return false;
      }
      
      // Verificar validez del token
      const decoded = jwt.verify(token, JWT_SECRET);
      return !!decoded;
    } catch (error) {
      logger.error('Error al verificar token mock', { error: error.message });
      return false;
    }
  }
  
  async refreshToken(token) {
    try {
      // Verificar si el token está en la lista negra
      if (tokenBlacklist.has(token)) {
        throw new Error('Token inválido o expirado');
      }
      
      // Verificar validez del token actual
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Generar nuevo token
      const newToken = jwt.sign(
        {
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
          name: decoded.name,
          lastName: decoded.lastName,
          role: decoded.role,
          permissions: decoded.permissions
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Agregar el token anterior a la lista negra
      tokenBlacklist.add(token);
      
      return newToken;
    } catch (error) {
      logger.error('Error al refrescar token mock', { error: error.message });
      throw error;
    }
  }
  
  async logout(token) {
    try {
      // Agregar el token a la lista negra
      tokenBlacklist.add(token);
      return true;
    } catch (error) {
      logger.error('Error en logout mock', { error: error.message });
      throw error;
    }
  }
  
  // Método para obtener la lista negra de tokens (para uso en middleware)
  getTokenBlacklist() {
    return tokenBlacklist;
  }
}

module.exports = MockAuthService;
