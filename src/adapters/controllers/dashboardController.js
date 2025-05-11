class DashboardController {
    constructor(getParkingCellWithRecomendationsUseCase) {
        this.getParkingCellWithRecomendationsUseCase = getParkingCellWithRecomendationsUseCase;
    }

    async getDashboardData(req, res) {
        try {
            const { parkingCells, recommendations } = await this.getParkingCellWithRecomendationsUseCase.execute();

            const formattedParkingCells = parkingCells.map(cell => ({
                parquederoid: cell.idStatic,
                Estado: cell.state
            }));

            return res.status(200).json({
                Parqueaderos: formattedParkingCells,
                Recomendaciones: recommendations
            });
        } catch (error) {
            console.error('Error en getDashboardData:', error.message);
            return res.status(500).json({
                message: 'Error interno al obtener los datos del dashboard',
                error: error.message
            });
        }
    }
}

module.exports = DashboardController;
