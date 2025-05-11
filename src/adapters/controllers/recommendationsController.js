const GetRecommendationsQuery = require('../../core/services/features/recommendations/queries/getRecommendations/getRecommendationsQuery');
const CreateHistoricalRecordCommand = require('../../core/services/features/recommendations/command/createHistoricalRecord/createHistoricalRecordCommand');
const logger = require('../../core/utils/logger');

class RecommendationController {
    constructor(getRecommendationsHandler,
                createRecommendationsHandler
    ) {
        this.getRecommendationsHandler = getRecommendationsHandler;
        this.createRecommendationsHandler = createRecommendationsHandler;
    }

    async getRecommendations(req, res) {
        try {
            const query = new GetRecommendationsQuery();

            const recommendations = await this.getRecommendationsHandler.handle(query);

            return res.status(200).json({ recommendations });
        } catch (error) {
            logger.error('Error al obtener recomendaciones', { error: error.message });
            return res.status(500).json({
                message: 'Error interno al generar recomendaciones',
                error: error.message
            });
        }
    }

    async createRecommendations(req, res) {
        try {
            const command = new CreateHistoricalRecordCommand(req.body);

            const recommendations = await this.createRecommendationsHandler.handle(command);

            return res.status(201).json({
                message: 'Registro histórico creado exitosamente',
                data: recommendations
            });
        } catch (error) {
            logger.error('Error al crear registros', { error: error.message });
            return res.status(500).json({
                message: 'Error interno al crear el registro histórico',
                error: error.message
            });
        }
    }
}

module.exports = RecommendationController;
