const mongoose = require('mongoose');
const HistoricalRecord = require('../infrastructure/database/models/HistoricalRecord');

async function fixMongoReservationDetails() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parkiu');
    console.log('✅ Conectado a MongoDB');

    const nowISOString = new Date().toISOString();
    let updatedCount = 0;

    // Buscar registros con estado 'reservado' sin reservationDetails
    const records = await HistoricalRecord.find({
      state: 'reservado',
      reservationDetails: { $exists: false }
    });

    console.log(`🔍 Documentos encontrados: ${records.length}`);

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      if (i < 10) {
        console.log(`Doc ID: ${record._id} | state: ${record.state} | reservationDetails:`, record.reservationDetails);
      }

      // Actualizar con reservationDetails
      await HistoricalRecord.findByIdAndUpdate(record._id, {
        reservationDetails: {
          reservedBy: 'sistema',
          startTime: nowISOString,
          endTime: nowISOString,
          reason: 'Asignado automáticamente por script de corrección'
        }
      });

      updatedCount++;
    }

    console.log(`✅ Se corrigieron ${updatedCount} documentos en MongoDB.`);
    console.log(new Date());
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error al corregir MongoDB:', error);
    throw error;
  }
}

fixMongoReservationDetails().catch(err => {
  console.error('❌ Error al corregir MongoDB:', err);
  process.exit(1);
});
