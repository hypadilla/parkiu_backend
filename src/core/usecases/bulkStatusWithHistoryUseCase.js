class BulkStatusWithHistoryUseCase {
    constructor(parkingCellRepository, historicalRecordRepository) {
        this.parkingCellRepository = parkingCellRepository;
        this.historicalRecordRepository = historicalRecordRepository;
    }

    async execute(data) {
        const sectores = data.data.sectores;
        const cellsToUpdate = [];

        for (const sector of sectores) {
            for (const [id, newState] of Object.entries(sector.celdas)) {
                const idStatic = parseInt(id);
                const currentCell = await this.parkingCellRepository.getByIdStatic(idStatic);

                let reservationDetailsForUpdate = null;
                if (newState === 'reservado') {
                    throw new Error(`Para la celda con idStatic ${idStatic}, el estado es 'reservado' pero no se proporcionaron reservationDetails válidos.`);
                }

                if (!currentCell || currentCell.state !== newState) {
                    const updatedDocId = await this.parkingCellRepository.upsertByStaticId(idStatic, newState, reservationDetailsForUpdate);
                    const updatedCell = await this.parkingCellRepository.getByIdStatic(idStatic);

                    cellsToUpdate.push({ idStatic, newState, updatedCell, previousState: currentCell?.state || null });
                }
            }
        }

        for (const cell of cellsToUpdate) {
            const { idStatic, newState, updatedCell, previousState } = cell;

            if (newState === 'ocupado' && previousState !== 'ocupado') {
                await this.historicalRecordRepository.create({
                    id: idStatic,
                    startTime: updatedCell.lastModifiedDate,
                    endTime: null,
                    status: newState
                });
            }

            if (previousState === 'ocupado' && newState !== 'ocupado') {
                const now = new Date();

                await this.historicalRecordRepository.updateLastOpenRecord(idStatic, now);
            }
        }

        return cellsToUpdate;
    }
}

module.exports = BulkStatusWithHistoryUseCase;
