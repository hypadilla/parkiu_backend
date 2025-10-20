/*
  Script: seedRealtimeDemo.js
  - Crea/actualiza celdas de parqueo (idStatic 1..50)
  - Simula cambios en tiempo real alterando estados aleatoriamente cada N segundos
*/

const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const ParkingCell = require(path.resolve(__dirname, '../src/infrastructure/database/models/ParkingCell.js'));

const STATES = ['disponible', 'ocupado', 'reservado', 'inhabilitado'];

function randomChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

async function upsertCell(idStatic, state, actor='seed-script') {
  const update = {
    state,
    lastModifiedDate: new Date(),
    lastModifiedBy: actor
  };

  if (state === 'reservado') {
    const now = new Date();
    const end = new Date(now.getTime() + 30 * 60000);
    update.reservationDetails = {
      reservedBy: actor,
      startTime: now.toISOString(),
      endTime: end.toISOString(),
      reason: 'Demo realtime'
    };
  } else {
    update.reservationDetails = undefined;
  }

  await ParkingCell.updateOne(
    { idStatic },
    { $set: { idStatic, ...update } },
    { upsert: true }
  );
}

async function seedInitial(count=50) {
  const ops = [];
  for (let i = 1; i <= count; i++) {
    const state = randomChoice(STATES);
    ops.push(upsertCell(i, state, 'seed-init'));
  }
  await Promise.all(ops);
  console.log(`✅ Celdas iniciales sembradas: ${count}`);
}

async function simulateChanges(intervalMs=4000) {
  console.log(`🔄 Simulando cambios cada ${intervalMs/1000}s... Ctrl+C para detener.`);
  setInterval(async () => {
    try {
      const id = 1 + Math.floor(Math.random()*50);
      const state = randomChoice(STATES);
      await upsertCell(id, state, 'seed-simulator');
      console.log(`✳️  Celda ${id} -> ${state}`);
    } catch (e) {
      console.error('❌ Error simulando cambio:', e.message);
    }
  }, intervalMs);
}

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/parkiu';
  await mongoose.connect(uri);
  console.log('✅ Conectado a MongoDB');

  await seedInitial(50);
  await simulateChanges(4000);
}

run().catch(err => {
  console.error('❌ Error en seedRealtimeDemo:', err);
  process.exit(1);
});
