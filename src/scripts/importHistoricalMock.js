// src/scripts/importHistoricalMock.js
const fs = require('fs');
const path = require('path');

// Asegúrate de que este require apunte a tu archivo de configuración de Firebase
const db = require('../infrastructure/database/firebaseService');

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
  console.log(`📦 Importando ${data.length} registros a Firestore...`);

  const batchSize = 500;
  let batch = db.batch();
  let counter = 0;

  for (let i = 0; i < data.length; i++) {
    const record = data[i];
    const docRef = db.collection('historicalData').doc(); // genera un ID aleatorio
    batch.set(docRef, record);
    counter++;

    // Ejecuta el batch cada 500 escrituras (límite Firestore)
    if (counter % batchSize === 0 || i === data.length - 1) {
      await batch.commit();
      console.log(`✅ Batch ${Math.ceil(counter / batchSize)} escrito.`);
      batch = db.batch(); // inicia nuevo batch
    }
  }

  console.log('✅ Importación completada con éxito.');
}

// Ejecutar
importData().catch((err) => {
  console.error('❌ Error durante la importación:', err.message);
  process.exit(1);
});
