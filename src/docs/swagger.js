const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Parking API",
      version: "1.0.0",
      description: "API para gestión de usuarios y parqueaderos.\n\nCambios recientes:\n- Migración a MongoDB (Mongoose).\n- Endpoints actualizados de Parking Cells (bulk-status por POST).\n- Seguridad por JWT (bearerAuth).\n- Tiempo real con Socket.IO y fallback por polling.",
    },
    servers: [
      { url: "http://localhost:3000", description: "Servidor local" },

      {
        url: "https://parkiubackend-production.up.railway.app",
        description: "Servidor de producción",
      },
    ],
    components: {
      schemas: {
        // Esquemas globales de modelos para referencia rápida
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'user', 'device'] },
            permissions: { type: 'array', items: { type: 'string' } },
            createdDate: { type: 'string', format: 'date-time' }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/docs/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
