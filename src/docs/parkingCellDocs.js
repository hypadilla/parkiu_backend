/**
 * @swagger
 * tags:
 *   name: ParkingCells
 *   description: Endpoints for managing parking cell statuses
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ParkingCellUpdate:
 *       type: object
 *       properties:
 *         idStatic:
 *           type: integer
 *           example: 6
 *         state:
 *           type: string
 *           enum: [ocupado, disponible]
 *           example: ocupado
 *       required:
 *         - idStatic
 *         - state
 *
 *     ParkingCellBulkRequest:
 *       type: object
 *       properties:
 *         sectores:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               cardinal_point:
 *                 type: string
 *                 example: Norte
 *               celdas:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *           example:
 *             - cardinal_point: Norte
 *               celdas:
 *                 "1": "ocupado"
 *                 "2": "disponible"
 *                 "3": "ocupado"
 *       required:
 *         - sectores
 *
 *     ParkingCellResponse:
 *       type: object
 *       properties:
 *         idStatic:
 *           type: integer
 *         state:
 *           type: string
 *           enum: [ocupado, disponible]
 *         lastModifiedDate:
 *           type: string
 *           format: date-time
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "An error occurred while updating statuses."
 */

/**
 * @swagger
 * /api/parking-cells/bulk-status:
 *   post:
 *     summary: Bulk update the status of parking cells
 *     tags: [ParkingCells]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParkingCellBulkRequest'
 *     responses:
 *       200:
 *         description: Bulk status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bulk status updated successfully.
 *       500:
 *         description: Error during bulk update
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *
 * /api/parking-cells/{id}/status:
 *   put:
 *     summary: Update the status of a single parking cell
 *     tags: [ParkingCells]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the parking cell document
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *                 enum: [ocupado, disponible, reservado]
 *               reservationDetails:
 *                 type: object
 *                 nullable: true
 *             required:
 *               - state
 *     responses:
 *       200:
 *         description: Estado actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Estado actualizado
 *       400:
 *         description: Error en la petición
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *
 * /api/parking-cells:
 *   get:
 *     summary: Get all parking cells
 *     tags: [ParkingCells]
 *     responses:
 *       200:
 *         description: Lista de celdas de parqueadero
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ParkingCellResponse'
 *       500:
 *         description: Error interno al obtener celdas
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */
