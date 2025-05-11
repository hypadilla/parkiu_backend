class CreateHistoricalRecordCommand {
  constructor({id, status, endTime, startTime}) {
    this.id = id;
    this.status = status;
    this.endTime = endTime;
    this.startTime = startTime;
  }
}

module.exports = CreateHistoricalRecordCommand;