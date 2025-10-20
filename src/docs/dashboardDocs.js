/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Endpoints for retrieving dashboard data
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardParkingCell:
 *       type: object
 *       properties:
 *         parquederoid:
 *           type: integer
 *           example: 12
 *         Estado:
 *           type: string
 *           enum: [ocupado, disponible, reservado]
 *           example: ocupado
 *
 *     Recommendation:
 *       type: object
 *       properties:
 *         idStatic:
 *           type: integer
 *           example: 3
 *         suggestedState:
 *           type: string
 *           enum: [ocupado, disponible, reservado]
 *           example: disponible
 *         reason:
 *           type: string
 *           example: Alta rotación en la última hora
 *
 *     DashboardResponse:
 *       type: object
 *       properties:
 *         Parqueaderos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DashboardParkingCell'
 *         Recomendaciones:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Recommendation'
 *
 *     DashboardError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Error interno al obtener los datos del dashboard
 *         error:
 *           type: string
 *           example: Detalles del error técnico
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtener datos del dashboard
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Datos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardError'
 */

/**
 * @swagger
 * /api/recommendations:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Listar recomendaciones activas y no expiradas
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Lista de recomendaciones
 *       500:
 *         description: Error interno del servidor
 */
