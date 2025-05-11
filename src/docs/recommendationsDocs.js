/**
 * @swagger
 * tags:
 *   name: Recommendations
 *   description: Endpoints for managing parking spot recommendations and historical usage data
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Recommendation:
 *       type: object
 *       properties:
 *         day:
 *           type: string
 *           example: Monday
 *         recommendedHours:
 *           type: array
 *           items:
 *             type: string
 *           example: ["7:00 AM", "10:00 AM"]
 *       required:
 *         - day
 *         - recommendedHours
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
 *           example: occupied
 *       required:
 *         - startTime
 *         - endTime
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Invalid request parameters"
 *         error:
 *           type: string
 *           example: "ValidationError"
 */

/**
 * @swagger
 * /api/recommendations:
 *   get:
 *     summary: Get parking spot recommendations
 *     tags: [Recommendations]
 *     responses:
 *       200:
 *         description: Successfully retrieved parking spot recommendations
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
 *         description: Server error while retrieving recommendations
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *
 *   post:
 *     summary: Create a historical parking usage record
 *     tags: [Recommendations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HistoricalRecord'
 *     responses:
 *       201:
 *         description: Historical record created successfully
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
 *         description: Invalid request or missing parameters
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error while creating historical record
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */
