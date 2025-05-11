const db = require('../database/firebaseService');
const HistoricalRecordMapper = require('../../core/services/mapping/historicalRecordMapper');

class HistoricalRecordRepository {
    constructor() {
        this.collection = db.collection('historicalData');
    }

    async getAll() {
        const snapshot = await this.collection.get();
        const records = [];
        snapshot.forEach(doc => {
            records.push(HistoricalRecordMapper.toDomain(doc.data()));
        });
        return records;
    }

    async create(record) {
        const data = HistoricalRecordMapper.toPersistence(record);
        await this.collection.add(data);
        return record;
    }

    async updateLastOpenRecord(idStatic, endTime) {
        const snapshot = await this.collection
            .where('id', '==', idStatic)
            .where('endTime', '==', null)
            .orderBy('startTime', 'desc')
            .limit(1)
            .get();

        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            await this.collection.doc(doc.id).update({ endTime });
        }
    }
}

module.exports = HistoricalRecordRepository;
