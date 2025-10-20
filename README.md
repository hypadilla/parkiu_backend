# 🚗 Parkiu Backend API

API REST para la gestión inteligente de parqueaderos con capacidades de tiempo real, autenticación JWT y base de datos MongoDB.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [WebSocket (Tiempo Real)](#-websocket-tiempo-real)
- [Documentación Swagger](#-documentación-swagger)
- [Testing](#-testing)
- [Despliegue](#-despliegue)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Contribución](#-contribución)

## ✨ Características

- 🔐 **Autenticación JWT** con refresh tokens
- 🚗 **Gestión de celdas de parqueo** (disponible, ocupado, reservado, inhabilitado)
- 📊 **Dashboard en tiempo real** con estadísticas
- 🔄 **WebSocket** para actualizaciones en vivo (con fallback a polling)
- 📝 **Sistema de recomendaciones** inteligentes
- 📈 **Registros históricos** de ocupación
- 🛡️ **Middleware de validación** y manejo de errores
- 📚 **Documentación Swagger** completa
- 🧪 **Cobertura de tests** del 75%+
- 🐳 **Dockerizado** para despliegue fácil

## 🛠️ Tecnologías

- **Node.js** 20+ con Express.js
- **MongoDB** con Mongoose ODM
- **Socket.IO** para tiempo real
- **JWT** para autenticación
- **Jest** para testing
- **Swagger** para documentación
- **Winston** para logging
- **Docker** para containerización

## 🚀 Instalación

### Prerrequisitos

- Node.js 20 o superior
- MongoDB 6.0 o superior
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd parkiu_backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
# Editar .env con tus configuraciones
```

4. **Iniciar MongoDB** (local)
```bash
# Con Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# O con MongoDB instalado localmente
mongod
```

5. **Ejecutar migración de datos** (opcional)
```bash
npm run migrate
```

6. **Iniciar servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` basado en `env.example`:

```env
# Puerto del servidor
PORT=3000

# Configuración de MongoDB
MONGODB_URI=mongodb://localhost:27017/parkiu

# JWT Secret (cambiar en producción)
JWT_SECRET=tu-jwt-secret-super-seguro-aqui

# Entorno
NODE_ENV=development

# CORS Origins (agregar tu dominio de frontend)
CORS_ORIGINS=http://localhost:4200,http://localhost:5173,https://tu-frontend.vercel.app
```

### Scripts Disponibles

```bash
npm start          # Iniciar en producción
npm run dev        # Iniciar en desarrollo con nodemon
npm test           # Ejecutar tests
npm run migrate    # Migrar datos de ejemplo
```

## 📖 Uso

### Autenticación

La API utiliza JWT para autenticación. Incluye el token en el header `Authorization`:

```bash
curl -H "Authorization: Bearer tu-jwt-token" \
     http://localhost:3000/api/parking-cells
```

### Ejemplo de Registro

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario",
    "email": "usuario@example.com",
    "password": "password123",
    "name": "Juan",
    "lastName": "Pérez"
  }'
```

### Ejemplo de Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario",
    "password": "password123"
  }'
```

## 🔗 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/verify-token` - Verificar token
- `POST /api/auth/refresh` - Renovar token

### Parqueaderos
- `GET /api/parking-cells` - Listar todas las celdas
- `PUT /api/parking-cells/:id/status` - Actualizar estado de celda
- `POST /api/parking-cells/bulk-status` - Actualización masiva

### Dashboard
- `GET /api/dashboard` - Datos del dashboard
- `GET /api/recommendations` - Recomendaciones activas

### Usuarios
- `GET /api/users` - Listar usuarios (admin)
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

## 🔌 WebSocket (Tiempo Real)

La API incluye capacidades de tiempo real usando Socket.IO con fallback automático a polling.

### Conexión

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Conectado al servidor');
});

// Suscribirse a actualizaciones de parqueaderos
socket.on('parkingCellsUpdate', (data) => {
  console.log('Actualización de parqueaderos:', data);
});

// Suscribirse a estadísticas
socket.on('statisticsUpdated', (stats) => {
  console.log('Estadísticas actualizadas:', stats);
});
```

### Eventos Disponibles

- `parkingCellsUpdate` - Actualización de celdas
- `statisticsUpdated` - Estadísticas actualizadas
- `parkingCellUpdated` - Celda específica actualizada
- `parkingCellStatusChanged` - Cambio de estado
- `parkingCellReserved` - Celda reservada
- `parkingCellReservationCancelled` - Reserva cancelada
- `notification` - Notificaciones generales
- `heartbeat` - Latido del servidor

## 📚 Documentación Swagger

La documentación interactiva está disponible en:

- **Local**: http://localhost:3000/api-docs
- **Producción**: https://tu-dominio.com/api-docs

Incluye:
- Esquemas de datos completos
- Ejemplos de requests/responses
- Códigos de error detallados
- Autenticación JWT

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests unitarios
npm test -- tests/unit

# Tests de integración
npm test -- tests/integration

# Con cobertura
npm test -- --coverage
```

### Cobertura Actual

- **Cobertura total**: 75%+
- **Tests unitarios**: Repositorios, handlers, mappers
- **Tests de integración**: Endpoints completos

## 🚀 Despliegue

### Docker

```bash
# Construir imagen
docker build -t parkiu-backend .

# Ejecutar contenedor
docker run -p 3000:3000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/parkiu \
  -e JWT_SECRET=tu-secret \
  parkiu-backend
```

### Railway

1. Conecta tu repositorio a Railway
2. Configura las variables de entorno
3. Railway detectará automáticamente el `Dockerfile`
4. El despliegue se realizará automáticamente

### Variables de Entorno para Producción

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/parkiu
JWT_SECRET=secret-super-seguro-de-produccion
CORS_ORIGINS=https://tu-frontend.vercel.app,https://tu-dominio.com
```

## 📁 Estructura del Proyecto

```
parkiu_backend/
├── src/
│   ├── adapters/           # Controladores, rutas, middlewares
│   ├── core/              # Lógica de negocio, casos de uso
│   ├── infrastructure/    # Repositorios, servicios externos
│   └── docs/              # Documentación Swagger
├── tests/                 # Tests unitarios e integración
├── scripts/               # Scripts de migración y utilidades
├── Dockerfile            # Configuración Docker
├── railway.json          # Configuración Railway
└── package.json          # Dependencias y scripts
```

### Arquitectura

- **Clean Architecture** con separación de capas
- **Domain-Driven Design** con entidades de negocio
- **Repository Pattern** para acceso a datos
- **Command/Query Separation** para operaciones

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- Usar ESLint y Prettier
- Escribir tests para nuevas funcionalidades
- Documentar cambios en la API
- Seguir convenciones de commits semánticos

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- 📧 Email: tu-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/parkiu/issues)
- 📖 Documentación: [Swagger UI](http://localhost:3000/api-docs)

---

**Desarrollado con ❤️ para la gestión inteligente de parqueaderos**
