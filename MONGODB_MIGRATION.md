# 🍃 Migración a MongoDB - Parkiu Backend

## 📋 Resumen de Cambios

Hemos migrado completamente de **Firebase Firestore** a **MongoDB** con las siguientes mejoras:

### ✅ **Completado:**
- ✅ Instalación de dependencias (mongoose, socket.io)
- ✅ Modelos Mongoose (User, ParkingCell, ReservationDetails, Recommendation, HistoricalRecord)
- ✅ Repositorios refactorizados para MongoDB
- ✅ Configuración de base de datos actualizada
- ✅ **Change Streams** para tiempo real nativo
- ✅ **WebSockets** con Socket.IO
- ✅ Script de migración de datos
- ✅ Aplicación principal actualizada

## 🚀 **Nuevas Características**

### 1. **Tiempo Real Nativo**
```javascript
// Los clientes reciben actualizaciones automáticas
socket.on('parkingCellUpdated', (data) => {
  console.log('Celda actualizada:', data);
});
```

### 2. **Change Streams de MongoDB**
- Escucha cambios en tiempo real
- Sin polling necesario
- Eficiente y escalable

### 3. **WebSockets con Socket.IO**
- Conexiones persistentes
- Salas para diferentes tipos de datos
- Reconexión automática

## 🛠️ **Instalación y Configuración**

### 1. **Variables de Entorno**
```env
MONGODB_URI=mongodb://localhost:27017/parkiu
JWT_SECRET=tu-jwt-secret
CORS_ORIGINS=http://localhost:4200,http://localhost:5173
```

### 2. **Instalar MongoDB Localmente**
```bash
# macOS con Homebrew
brew install mongodb-community

# Iniciar MongoDB
brew services start mongodb-community
```

### 3. **Ejecutar Migración**
```bash
cd parkiu_backend
node scripts/migrate-to-mongodb.js
```

### 4. **Iniciar Servidor**
```bash
npm start
```

## 📊 **Comparación: Firebase vs MongoDB**

| Característica | Firebase | MongoDB |
|----------------|----------|---------|
| **Tiempo Real** | ✅ Nativo | ✅ Change Streams |
| **Rendimiento** | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Control** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Costo** | ⭐⭐ | ⭐⭐⭐⭐ |
| **Escalabilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Flexibilidad** | ⭐⭐ | ⭐⭐⭐⭐⭐ |

## 🔌 **WebSocket Events**

### **Cliente → Servidor:**
- `joinRoom(room)` - Unirse a una sala
- `subscribeToParkingCells()` - Suscribirse a celdas
- `subscribeToUsers()` - Suscribirse a usuarios
- `subscribeToRecommendations()` - Suscribirse a recomendaciones
- `ping()` - Ping para mantener conexión

### **Servidor → Cliente:**
- `connected` - Conexión establecida
- `parkingCellUpdated` - Celda actualizada
- `parkingCellCreated` - Celda creada
- `parkingCellDeleted` - Celda eliminada
- `userUpdated` - Usuario actualizado
- `recommendationUpdated` - Recomendación actualizada

## 🧪 **Testing**

```bash
# Ejecutar tests
npm test

# Con cobertura
npm test -- --coverage
```

## 🚀 **Despliegue**

### **Railway/Render:**
1. Configurar `MONGODB_URI` en variables de entorno
2. Usar MongoDB Atlas para producción
3. El servidor se inicia automáticamente con WebSockets

### **Docker:**
```dockerfile
# El Dockerfile existente funciona con MongoDB
# Solo cambiar MONGODB_URI en .env
```

## 📈 **Beneficios de la Migración**

1. **Tiempo Real Eficiente** - Sin polling, actualizaciones instantáneas
2. **Mejor Rendimiento** - Consultas más rápidas
3. **Mayor Control** - Flexibilidad total en consultas
4. **Costo Reducido** - MongoDB es más económico
5. **Escalabilidad** - Mejor para aplicaciones grandes
6. **Estándar de la Industria** - Tecnología más común

## 🔧 **Próximos Pasos**

1. **Actualizar Frontend** - Implementar WebSocket client
2. **Optimizar Queries** - Agregar índices específicos
3. **Monitoreo** - Implementar métricas de rendimiento
4. **Backup** - Configurar respaldos automáticos

---

**¡La migración está completa! 🎉**
