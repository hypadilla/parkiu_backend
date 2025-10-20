/**
 * @swagger
 * tags:
 *   name: Recomendaciones
 *   description: Endpoints para gestionar recomendaciones y datos históricos de uso
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Recommendation:
 *       type: object
 *       properties:
 *         dia:
 *           type: string
 *           example: Lunes
 *         horasRecomendadas:
 *           type: array
 *           items:
 *             type: string
 *           example: ["7:00 AM", "10:00 AM"]
 *       required:
 *         - dia
 *         - horasRecomendadas
 *
 *     HistoricalRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: abc123
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2024-08-31T07:00:00Z"
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: "2024-08-31T09:00:00Z"
 *         status:
 *           type: string
 *           example: ocupado
 *       required:
 *         - startTime
 *         - endTime
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Parámetros de solicitud inválidos"
 *         error:
 *           type: string
 *           example: "ValidationError"
 */

/**
 * @swagger
 * /api/recommendations:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtener recomendaciones de parqueo
 *     tags: [Recomendaciones]
 *     responses:
 *       200:
 *         description: Recomendaciones obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recommendation'
 *       500:
 *         description: Error del servidor al obtener recomendaciones
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *
 *   post:
 *     summary: Crear un registro histórico de uso de parqueo
 *     tags: [Recomendaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HistoricalRecord'
 *     responses:
 *       201:
 *         description: Registro histórico creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registro histórico creado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/HistoricalRecord'
 *       400:
 *         description: Solicitud inválida o parámetros faltantes
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor al crear el registro histórico
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */
