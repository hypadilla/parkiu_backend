class CreateHistoricalRecordHandler {
    constructor(historicalRecordRepository) {
        this.historicalRecordRepository = historicalRecordRepository;
    }

    async handle(command) {
        if (!command.startTime || !command.endTime) {
            throw new Error('startTime y endTime son obligatorios');
        }

        return await this.historicalRecordRepository.create({
            id: command.id,
            startTime: command.startTime,
            endTime: command.endTime,
            status: command.status || 'desconocido',
        });
    }
}

module.exports = CreateHistoricalRecordHandler;
