const db = require('../infrastructure/database/firebaseService');

async function fixFirestoreReservationDetails() {
  const collectionRef = db.collection('historicalData');
  const snapshot = await collectionRef.get();

  let updatedCount = 0;
  const nowISOString = new Date().toISOString();

  const batchSize = 500;
  let batch = db.batch();
  let counter = 0;

  console.log(`🔍 Documentos en colección: ${snapshot.size}`);

  snapshot.forEach((doc, index) => {
    const data = doc.data();

    if (index < 10) {
      console.log(`Doc ID: ${doc.id} | state: ${data.state} | reservationDetails:`, data.reservationDetails);
    }

    if (data.state === 'reservado' && data.reservationDetails == null) {
      const docRef = collectionRef.doc(doc.id);
      batch.update(docRef, {
        reservationDetails: {
          reservedBy: 'sistema',
          startTime: nowISOString,
          endTime: nowISOString,
          reason: 'Asignado automáticamente por script de corrección'
        }
      });
      updatedCount++;
      counter++;
    }

    if (counter >= batchSize) {
      batch.commit();
      batch = db.batch();
      counter = 0;
    }
  });

  if (counter > 0) {
    await batch.commit();
  }

  console.log(`✅ Se corrigieron ${updatedCount} documentos en Firestore.`);
  console.log(new Date())
}

fixFirestoreReservationDetails().catch(err => {
  console.error('❌ Error al corregir Firestore:', err);
  process.exit(1);
});
