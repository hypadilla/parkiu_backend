// src/scripts/importHistoricalMock.js
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const HistoricalRecord = require('../infrastructure/database/models/HistoricalRecord');

// Ruta absoluta al archivo JSON
const filePath = path.join(__dirname, 'historicalDataMock.json');

// Leer y parsear el archivo JSON
let data;
try {
  const rawData = fs.readFileSync(filePath, 'utf8');
  data = JSON.parse(rawData);
} catch (err) {
  console.error('❌ Error al leer el archivo JSON:', err.message);
  process.exit(1);
}

// Función de importación
async function importData() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parkiu');
    console.log('✅ Conectado a MongoDB');
    
    console.log(`📦 Importando ${data.length} registros a MongoDB...`);

    const batchSize = 1000; // MongoDB puede manejar más registros por batch
    let counter = 0;

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      // Insertar batch en MongoDB
      await HistoricalRecord.insertMany(batch, { ordered: false });
      
      counter += batch.length;
      console.log(`✅ Batch ${Math.ceil(counter / batchSize)} escrito. ${counter}/${data.length} registros.`);
    }

    console.log('✅ Importación completada con éxito.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error durante la importación:', error.message);
    throw error;
  }
}

// Ejecutar
importData().catch((err) => {
  console.error('❌ Error durante la importación:', err.message);
  process.exit(1);
});
