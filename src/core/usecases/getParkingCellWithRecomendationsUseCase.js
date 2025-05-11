class GetParkingCellWithRecomendationsUseCase {
    constructor(getAllParkingCellHandler, getRecommendationsHandler) {
        this.getAllParkingCellHandler = getAllParkingCellHandler;
        this.getRecommendationsHandler = getRecommendationsHandler;
    }

    async execute() {
        const parkingCells = await this.getAllParkingCellHandler.handle();

        const recommendations = await this.getRecommendationsHandler.handle();

        return {
            parkingCells,
            recommendations
        };
    }
}

module.exports = GetParkingCellWithRecomendationsUseCase;
