#!/usr/bin/env node

const mongoService = require('../src/infrastructure/database/mongoService');
const User = require('../src/infrastructure/database/models/User');
const ParkingCell = require('../src/infrastructure/database/models/ParkingCell');
const Recommendation = require('../src/infrastructure/database/models/Recommendation');

async function migrateToMongoDB() {
  try {
    console.log('🚀 Iniciando migración a MongoDB...');
    
    // Conectar a MongoDB
    await mongoService.connect();
    
    // Crear datos de ejemplo
    await createSampleData();
    
    console.log('✅ Migración completada exitosamente');
  } catch (error) {
    console.error('❌ Error en migración:', error);
  } finally {
    await mongoService.disconnect();
  }
}

async function createSampleData() {
  console.log('📝 Creando datos de ejemplo...');
  
  // Crear usuarios de ejemplo
  const users = await User.insertMany([
    {
      username: 'admin',
      email: 'admin@parkiu.com',
      password: '$2b$10$example', // Hash de ejemplo
      name: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      permissions: ['CAN_VIEW_USERS', 'CAN_EDIT_USERS', 'CAN_DELETE_USERS']
    },
    {
      username: 'user1',
      email: 'user1@parkiu.com',
      password: '$2b$10$example',
      name: 'Usuario',
      lastName: 'Uno',
      role: 'USER',
      permissions: ['CAN_CREATE_RESERVATION', 'CAN_VIEW_RESERVATIONS']
    }
  ]);
  
  // Crear celdas de estacionamiento
  const parkingCells = [];
  for (let i = 1; i <= 20; i++) {
    parkingCells.push({
      idStatic: i,
      state: i <= 15 ? 'disponible' : 'ocupado',
      createdBy: 'system'
    });
  }
  
  await ParkingCell.insertMany(parkingCells);
  
  // Crear recomendaciones
  await Recommendation.insertMany([
    {
      message: 'Hay 15 celdas disponibles en el estacionamiento',
      priority: 'medium',
      type: 'availability'
    },
    {
      message: 'Mantenimiento programado para mañana a las 2:00 PM',
      priority: 'high',
      type: 'maintenance'
    }
  ]);
  
  console.log('✅ Datos de ejemplo creados');
}

if (require.main === module) {
  migrateToMongoDB();
}

module.exports = { migrateToMongoDB };
