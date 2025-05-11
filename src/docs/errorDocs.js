/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           example: "INVALID_REQUEST"
 *         message:
 *           type: string
 *           example: "Los datos enviados no son válidos."
 *         details:
 *           type: array
 *           items:
 *             type: string
 *           example: ["El campo 'email' es obligatorio."]
 *       required:
 *         - code
 *         - message
 */
