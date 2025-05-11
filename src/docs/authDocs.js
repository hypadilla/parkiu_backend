/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para el manejo de autenticación y autorización
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           example: apuerta
 *         password:
 *           type: string
 *           example: 12345678
 *       required:
 *         - username
 *         - password
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInVzZXJuYW1lIjoiYXB1ZXJ0YSJ9.ZP4qZc9h3BqJ-jnbH0G9Ch1pp2jzSYPVVsIu8tbOTpY"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: ValidationError
 *             message:
 *               type: string
 *               example: "Credenciales inválidas"
 *             stack:
 *               type: string
 *               example: "Error stack trace"
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Usuario registrado exitosamente"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInVzZXJuYW1lIjoiYXB1ZXJ0YSJ9.ZP4qZc9h3BqJ-jnbH0G9Ch1pp2jzSYPVVsIu8tbOTpY"
 *       400:
 *         description: Datos faltantes o inválidos
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error al registrar usuario
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión y devuelve un token
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: Login exitoso y token generado
 *         content:
 *           application/json:
 *             example:
 *               message: "Inicio de sesión exitoso"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInVzZXJuYW1lIjoiYXB1ZXJ0YSJ9.ZP4qZc9h3BqJ-jnbH0G9Ch1pp2jzSYPVVsIu8tbOTpY"
 *       400:
 *         description: Credenciales incorrectas
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error al intentar iniciar sesión
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cierra sesión de un usuario
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Cierre de sesión exitoso
 *         content:
 *           application/json:
 *             example:
 *               message: "Sesión cerrada correctamente"
 *       500:
 *         description: Error al intentar cerrar sesión
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresca el token de autenticación
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Token actualizado correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Token actualizado"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInVzZXJuYW1lIjoiYXB1ZXJ0YSJ9.ZP4qZc9h3BqJ-jnbH0G9Ch1pp2jzSYPVVsIu8tbOTpY"
 *       401:
 *         description: Token inválido o expirado
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error al refrescar el token
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/verify-token:
 *   post:
 *     summary: Verifica la validez del token
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInVzZXJuYW1lIjoiYXB1ZXJ0YSJ9.ZP4qZc9h3BqJ-jnbH0G9Ch1pp2jzSYPVVsIu8tbOTpY"
 *     responses:
 *       200:
 *         description: Token verificado correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Token válido"
 *       400:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error al verificar el token
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */
