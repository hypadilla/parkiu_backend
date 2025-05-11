const { DateTime } = require('luxon');
const HistoricalRecordMapper = require('../../../../mapping/historicalRecordMapper');

const START_HOUR = 8;
const END_HOUR = 20;
const MAX_CAPACITY_PER_HOUR = 65;

class GetRecommendationsHandler {
    constructor(historicalRecordRepository) {
        this.historicalRecordRepository = historicalRecordRepository;
    }

    async handle(query) {
        const data = await this.historicalRecordRepository.getAll();
        const occupancyMap = {};

        for (const record of data) {
            const start = DateTime.fromISO(record.startTime, { zone: 'utc' });
            const end = DateTime.fromISO(record.endTime, { zone: 'utc' });

            let cursor = start.startOf('hour');

            while (cursor < end) {
                const hour = cursor.hour;
                const day = cursor.setLocale('es').toFormat('cccc');

                if (day.toLowerCase() === 'domingo') {
                    cursor = cursor.plus({ hours: 1 });
                    continue;
                }

                if (hour >= START_HOUR && hour < END_HOUR) {
                    const hourStr = `${hour.toString().padStart(2, '0')}:00`;

                    occupancyMap[day] = occupancyMap[day] || {};
                    occupancyMap[day][hourStr] = (occupancyMap[day][hourStr] || 0) + 1;
                }

                cursor = cursor.plus({ hours: 1 });
            }
        }

        const recommendations = [];

        for (const day of Object.keys(occupancyMap)) {
            const recommendedHours = [];

            for (let hour = START_HOUR; hour < END_HOUR; hour++) {
                const hourStr = `${hour.toString().padStart(2, '0')}:00`;
                const occupiedCeldas = occupancyMap[day]?.[hourStr] || 0;
                const occupancyRate = (occupiedCeldas / MAX_CAPACITY_PER_HOUR) * 100;

                console.log(`Día: ${day}, Hora: ${hourStr}, Ocupadas: ${occupiedCeldas}, Ocupación: ${occupancyRate.toFixed(2)}%`);

                if (occupancyRate < 80) {
                    recommendedHours.push(hourStr);
                }
            }

            recommendations.push({ day, recommendedHours });
        }

        return recommendations.map(HistoricalRecordMapper.toClient);
    }
}

module.exports = GetRecommendationsHandler;
