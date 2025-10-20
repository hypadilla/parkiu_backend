// Mock de dependencias pesadas durante tests de integración
jest.mock('../../src/infrastructure/database/mongoService', () => ({
  connect: jest.fn(async () => Promise.resolve()),
  disconnect: jest.fn(async () => Promise.resolve()),
  isConnected: true,
  getConnection: jest.fn(() => ({ admin: () => ({ replSetGetStatus: async () => ({ ok: 0 }) }) }))
}));
jest.mock('../../src/infrastructure/websocket/websocketService', () => ({
  initialize: jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    close: jest.fn()
  })),
  startRealtimeServices: jest.fn(async () => Promise.resolve()),
  stopRealtimeServices: jest.fn(async () => Promise.resolve()),
  getIO: jest.fn(() => ({ emit: jest.fn() }))
}));

// Evitar que los tests terminen el proceso
const originalExit = process.exit;
process.exit = jest.fn();

// Importar app DESPUÉS de mockear dependencias
const { server, initializeApp } = require('../../src/adapters/app');

// Setup para tests de integración
let isAppInitialized = false;

const setupIntegrationTests = async () => {
  if (!isAppInitialized) {
    try {
      await initializeApp();
      isAppInitialized = true;
      console.log('✅ Aplicación inicializada para tests de integración');
    } catch (error) {
      console.error('❌ Error inicializando aplicación para tests:', error);
      // No lanzar error para permitir que las suites continúen
    }
  }
  return server;
};

const cleanupIntegrationTests = async () => {
  // No necesitamos limpiar nada específico ya que los tests usan la misma instancia
  console.log('🧹 Limpieza de tests de integración completada');
  // Restaurar process.exit
  process.exit = originalExit;
};

module.exports = {
  setupIntegrationTests,
  cleanupIntegrationTests
};
