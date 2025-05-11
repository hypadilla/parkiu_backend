const BaseDomainModel = require('./common/baseDomainModel');

class HistoricalRecord extends BaseDomainModel {
    constructor({ id, startTime, endTime }) {
        super({ id });
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

module.exports = HistoricalRecord;