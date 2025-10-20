# 📡 Parkiu API - Guía Técnica

Documentación técnica detallada de la API de Parkiu para desarrolladores.

## 🔧 Configuración Técnica

### Variables de Entorno Requeridas

```env
# Servidor
PORT=3000
NODE_ENV=development|production

# Base de Datos
MONGODB_URI=mongodb://localhost:27017/parkiu

# Autenticación
JWT_SECRET=tu-jwt-secret-super-seguro
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS
CORS_ORIGINS=http://localhost:4200,http://localhost:5173

# Logging
LOG_LEVEL=info|debug|error
```

### Headers Requeridos

```http
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

## 🔐 Autenticación

### Flujo de Autenticación

1. **Registro**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login`
3. **Usar Token**: Incluir en header `Authorization`
4. **Refresh**: `POST /api/auth/refresh` (opcional)
5. **Logout**: `POST /api/auth/logout`

### Estructura del Token JWT

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "username": "usuario",
  "role": "user|admin|device",
  "iat": 1640995200,
  "exp": 1640998800
}
```

### Códigos de Respuesta de Autenticación

| Código | Descripción | Ejemplo |
|--------|-------------|---------|
| 200 | Login exitoso | `{ "token": "...", "refreshToken": "..." }` |
| 201 | Registro exitoso | `{ "message": "Usuario registrado", "user": {...} }` |
| 400 | Datos inválidos | `{ "errors": [...] }` |
| 401 | Credenciales inválidas | `{ "message": "Invalid credentials" }` |
| 500 | Error del servidor | `{ "error": "Internal server error" }` |

## 🚗 Endpoints de Parqueaderos

### GET /api/parking-cells

Obtiene todas las celdas de parqueo.

**Headers**: `Authorization: Bearer <token>`

**Response 200**:
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "idStatic": 1,
    "state": "disponible",
    "ubicacion": "Nivel 1, Celda 1",
    "tipo": "carro",
    "reservationDetails": null,
    "lastModifiedDate": "2024-01-01T10:00:00.000Z"
  }
]
```

### PUT /api/parking-cells/:id/status

Actualiza el estado de una celda específica.

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "state": "reservado",
  "reservationDetails": {
    "reservedBy": "user123",
    "startTime": "2024-01-01T10:00:00.000Z",
    "endTime": "2024-01-01T11:00:00.000Z",
    "reason": "Reunión importante"
  }
}
```

**Estados Válidos**:
- `disponible` - Celda libre
- `ocupado` - Celda ocupada
- `reservado` - Celda reservada (requiere `reservationDetails`)
- `inhabilitado` - Celda fuera de servicio

### POST /api/parking-cells/bulk-status

Actualización masiva de estados de celdas.

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "sectores": [
    {
      "id": "sector1",
      "celdas": [
        { "idStatic": 1, "state": "ocupado" },
        { "idStatic": 2, "state": "disponible" }
      ]
    }
  ]
}
```

## 📊 Dashboard

### GET /api/dashboard

Obtiene datos del dashboard incluyendo parqueaderos y recomendaciones.

**Headers**: `Authorization: Bearer <token>`

**Response 200**:
```json
{
  "Parqueaderos": [
    {
      "id": "507f1f77bcf86cd799439011",
      "idStatic": 1,
      "state": "disponible",
      "ubicacion": "Nivel 1, Celda 1"
    }
  ],
  "Recomendaciones": [
    {
      "id": "507f1f77bcf86cd799439012",
      "message": "Alta ocupación en sector Norte",
      "priority": 5,
      "type": "ocupacion_alta"
    }
  ]
}
```

### GET /api/recommendations

Obtiene recomendaciones activas y no expiradas.

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `priority` (opcional): Filtrar por prioridad (1-5)
- `type` (opcional): Filtrar por tipo

## 🔌 WebSocket API

### Conexión

```javascript
const socket = io('http://localhost:3000', {
  transports: ['websocket', 'polling']
});
```

### Eventos del Cliente

#### Suscribirse a Actualizaciones
```javascript
socket.emit('subscribeToParkingCells');
```

### Eventos del Servidor

#### parkingCellsUpdate
Actualización de celdas de parqueo.

```javascript
socket.on('parkingCellsUpdate', (data) => {
  console.log(data);
  // {
  //   data: [...], // Array de celdas actualizadas
  //   timestamp: "2024-01-01T10:00:00.000Z",
  //   type: "incremental"
  // }
});
```

#### statisticsUpdated
Estadísticas actualizadas.

```javascript
socket.on('statisticsUpdated', (stats) => {
  console.log(stats);
  // {
  //   total: 20,
  //   available: 15,
  //   occupied: 3,
  //   reserved: 2,
  //   disabled: 0,
  //   timestamp: "2024-01-01T10:00:00.000Z"
  // }
});
```

#### parkingCellUpdated
Celda específica actualizada.

```javascript
socket.on('parkingCellUpdated', (data) => {
  console.log(data);
  // {
  //   id: "507f1f77bcf86cd799439011",
  //   data: { ... }, // Datos completos de la celda
  //   type: "update"
  // }
});
```

#### notification
Notificaciones generales.

```javascript
socket.on('notification', (notification) => {
  console.log(notification);
  // {
  //   message: "Sistema actualizado",
  //   type: "info|warning|error",
  //   timestamp: "2024-01-01T10:00:00.000Z"
  // }
});
```

#### heartbeat
Latido del servidor (cada 30 segundos).

```javascript
socket.on('heartbeat', (heartbeat) => {
  console.log(heartbeat);
  // {
  //   timestamp: "2024-01-01T10:00:00.000Z",
  //   status: "alive"
  // }
});
```

## 🚨 Manejo de Errores

### Estructura de Error

```json
{
  "message": "Descripción del error",
  "errors": [
    {
      "msg": "Mensaje específico de validación",
      "path": "campo",
      "value": "valor inválido"
    }
  ]
}
```

### Códigos de Error Comunes

| Código | Descripción | Solución |
|--------|-------------|----------|
| 400 | Bad Request | Verificar formato de datos |
| 401 | Unauthorized | Verificar token JWT |
| 403 | Forbidden | Verificar permisos de usuario |
| 404 | Not Found | Verificar ID de recurso |
| 422 | Validation Error | Verificar datos de entrada |
| 500 | Internal Server Error | Contactar soporte |

### Ejemplos de Errores

#### Error de Validación
```json
{
  "errors": [
    {
      "msg": "El estado debe ser uno de: disponible, ocupado, reservado, inhabilitado",
      "path": "state",
      "value": "invalid_state"
    }
  ]
}
```

#### Error de Autenticación
```json
{
  "message": "Token inválido o expirado"
}
```

## 📈 Rate Limiting

La API implementa rate limiting básico:

- **Requests por minuto**: 100 (por IP)
- **Burst**: 20 requests en 10 segundos
- **Headers de respuesta**:
  - `X-RateLimit-Limit`: Límite de requests
  - `X-RateLimit-Remaining`: Requests restantes
  - `X-RateLimit-Reset`: Timestamp de reset

## 🔍 Logging

### Niveles de Log

- `error`: Errores críticos
- `warn`: Advertencias
- `info`: Información general
- `debug`: Información detallada

### Formato de Logs

```json
{
  "timestamp": "2024-01-01T10:00:00.000Z",
  "level": "info",
  "message": "Request processed",
  "method": "GET",
  "url": "/api/parking-cells",
  "statusCode": 200,
  "responseTime": 45
}
```

## 🧪 Testing

### Endpoints de Testing

- `POST /api/auth/register-test-user` - Registrar usuario para testing
- `GET /api/health` - Health check

### Ejemplos de Tests

```javascript
// Test de autenticación
const response = await request(app)
  .post('/api/auth/login')
  .send({
    username: 'testuser',
    password: 'password123'
  })
  .expect(200);

expect(response.body).toHaveProperty('token');
```

## 🚀 Despliegue

### Railway

1. Conectar repositorio
2. Configurar variables de entorno
3. Deploy automático en push a `main`

### Docker

```bash
docker build -t parkiu-backend .
docker run -p 3000:3000 parkiu-backend
```

### Variables de Producción

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/parkiu
JWT_SECRET=super-secret-production-key
CORS_ORIGINS=https://tu-frontend.com
```

## 📞 Soporte

- **Documentación Swagger**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/api/health
- **WebSocket Test**: http://localhost:3000 (conectarse con Socket.IO client)

---

*Última actualización: Enero 2024*
