/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints de gestión de usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           example: apuerta
 *         password:
 *           type: string
 *           example: 12345678
 *         email:
 *           type: string
 *           example: user@example.com
 *         name:
 *           type: string
 *           example: Ana
 *         lastName:
 *           type: string
 *           example: Puerta
 *         role:
 *           type: string
 *           example: admin
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           example: ['create:users', 'edit:profile']
 *       required:
 *         - email
 *         - password
 *         - role
 *         - name
 *         - lastName
 *         - username
 *         - permissions
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
 *               example: "El nombre de usuario ya está en uso"
 *             stack:
 *               type: string
 *               example: "Error stack trace"
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content: 
 *           application/json:
 *             example:
 *               id: 123
 *               username: apuerta
 *               email: user@example.com
 *               name: Ana
 *               lastName: Puerta
 *               role: admin
 *               permissions: ['create:users', 'edit:profile']
 *       400:
 *         description: Datos faltantes o inválidos
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error al crear usuario
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Elimina un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: string
 *           example: '123'
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *         content: 
 *           application/json:
 *             example:
 *               message: "Usuario eliminado correctamente"
 *       400:
 *         description: Datos faltantes o inválidos
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error al eliminar usuario
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene una lista paginada de usuarios
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de usuarios a devolver por página
 *       - in: query
 *         name: lastVisible
 *         schema:
 *           type: string
 *         description: ID del último usuario de la página anterior (para paginación)
 *     responses:
 *       200:
 *         description: Lista paginada de usuarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 lastVisible:
 *                   type: string
 *                   nullable: true
 *                   description: ID del último documento de la página actual, útil para la siguiente página
 *       500:
 *         description: Error al obtener los usuarios
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario a obtener
 *         schema:
 *           type: string
 *           example: '123'
 *     responses:
 *       200:
 *         description: Usuario encontrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error al obtener usuario
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario a actualizar
 *         schema:
 *           type: string
 *           example: '123'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error al actualizar usuario
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/user/username/{username}:
 *   get:
 *     summary: Busca un usuario por su nombre de usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Nombre de usuario a buscar
 *         schema:
 *           type: string
 *           example: apuerta
 *     responses:
 *       200:
 *         description: Usuario encontrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error al buscar el usuario
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtiene el usuario autenticado (owner de la sesión)
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Usuario autenticado encontrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error al obtener usuario autenticado
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */
