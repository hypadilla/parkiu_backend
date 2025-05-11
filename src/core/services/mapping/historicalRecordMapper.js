const HistoricalRecord = require('../../domain/historicalRecord');

class HistoricalRecordMapper {
    static toDomain(doc) {
        return new HistoricalRecord({
            id: doc.id,
            startTime: doc.startTime,
            endTime: doc.endTime
        });
    }

    static toPersistence(record) {
        return {
            startTime: record.startTime,
            endTime: record.endTime,
            status: record.status,
            id: record.id,
        };
    }

    static toClient(recommendation) {
        return {
            day: recommendation.day,
            recommendedHours: recommendation.recommendedHours
        };
    }
}

module.exports = HistoricalRecordMapper;