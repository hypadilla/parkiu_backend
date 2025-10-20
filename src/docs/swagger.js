const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Parking API",
      version: "1.0.0",
      description: "API para gestión de usuarios y parqueaderos",
    },
    servers: [
      { url: "http://localhost:3000", description: "Servidor local" },

      {
        url: "https://parkiubackend-production.up.railway.app",
        description: "Servidor de producción",
      },
    ],
    components: {
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
