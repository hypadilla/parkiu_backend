const { Server } = require('socket.io');
const changeStreamService = require('./changeStreamService');
const mongoService = require('../database/mongoService');

class WebSocketService {
  constructor() {
    this.io = null;
    this.connectedClients = new Map();
  }

  initialize(server) {
    try {
      // Configurar CORS para WebSockets
      this.io = new Server(server, {
        cors: {
          origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:4200', 'http://localhost:5173'],
          methods: ['GET', 'POST'],
          credentials: true
        },
        transports: ['websocket', 'polling']
      });

      this.setupEventHandlers();
      changeStreamService.setSocketIO(this.io);

      console.log('✅ WebSocket Service inicializado');
      return this.io;
    } catch (error) {
      console.error('❌ Error inicializando WebSocket Service:', error);
      throw error;
    }
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔌 Cliente conectado: ${socket.id}`);
      
      // Registrar cliente
      this.connectedClients.set(socket.id, {
        id: socket.id,
        connectedAt: new Date(),
        rooms: new Set()
      });

      // Eventos del cliente
      socket.on('joinRoom', (room) => {
        socket.join(room);
        this.connectedClients.get(socket.id).rooms.add(room);
        console.log(`📱 Cliente ${socket.id} se unió a la sala: ${room}`);
      });

      socket.on('leaveRoom', (room) => {
        socket.leave(room);
        this.connectedClients.get(socket.id).rooms.delete(room);
        console.log(`📱 Cliente ${socket.id} salió de la sala: ${room}`);
      });

      socket.on('subscribeToParkingCells', () => {
        socket.join('parkingCells');
        this.connectedClients.get(socket.id).rooms.add('parkingCells');
        console.log(`📱 Cliente ${socket.id} suscrito a ParkingCells`);
      });

      socket.on('subscribeToUsers', () => {
        socket.join('users');
        this.connectedClients.get(socket.id).rooms.add('users');
        console.log(`📱 Cliente ${socket.id} suscrito a Users`);
      });

      socket.on('subscribeToRecommendations', () => {
        socket.join('recommendations');
        this.connectedClients.get(socket.id).rooms.add('recommendations');
        console.log(`📱 Cliente ${socket.id} suscrito a Recommendations`);
      });

      socket.on('getConnectionStatus', () => {
        socket.emit('connectionStatus', {
          isConnected: mongoService.isConnected,
          mongoStatus: mongoService.getConnectionStatus(),
          changeStreamStatus: changeStreamService.getChangeStreamStatus(),
          connectedClients: this.connectedClients.size
        });
      });

      socket.on('ping', () => {
        socket.emit('pong', { timestamp: new Date().toISOString() });
      });

      socket.on('disconnect', (reason) => {
        console.log(`🔌 Cliente desconectado: ${socket.id}, razón: ${reason}`);
        this.connectedClients.delete(socket.id);
      });

      // Enviar estado inicial
      socket.emit('connected', {
        message: 'Conectado al servidor WebSocket',
        timestamp: new Date().toISOString(),
        availableRooms: ['parkingCells', 'users', 'recommendations']
      });
    });
  }

  async startRealtimeServices() {
    try {
      // Conectar a MongoDB si no está conectado
      if (!mongoService.isConnected) {
        await mongoService.connect();
      }

      // Iniciar Change Streams
      await changeStreamService.startChangeStreams();

      console.log('✅ Servicios de tiempo real iniciados');
    } catch (error) {
      console.error('❌ Error iniciando servicios de tiempo real:', error);
      throw error;
    }
  }

  async stopRealtimeServices() {
    try {
      await changeStreamService.stopChangeStreams();
      console.log('✅ Servicios de tiempo real detenidos');
    } catch (error) {
      console.error('❌ Error deteniendo servicios de tiempo real:', error);
      throw error;
    }
  }

  // Métodos para emitir eventos específicos
  emitToRoom(room, event, data) {
    if (this.io) {
      this.io.to(room).emit(event, data);
    }
  }

  emitToAll(event, data) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }

  emitToClient(socketId, event, data) {
    if (this.io) {
      this.io.to(socketId).emit(event, data);
    }
  }

  // Métodos específicos para el dominio
  emitParkingCellUpdate(cellData) {
    this.emitToRoom('parkingCells', 'parkingCellUpdated', {
      data: cellData,
      timestamp: new Date().toISOString()
    });
  }

  emitParkingCellStatusChange(cellId, newStatus) {
    this.emitToRoom('parkingCells', 'parkingCellStatusChanged', {
      cellId,
      newStatus,
      timestamp: new Date().toISOString()
    });
  }

  emitRecommendationUpdate(recommendationData) {
    this.emitToRoom('recommendations', 'recommendationUpdated', {
      data: recommendationData,
      timestamp: new Date().toISOString()
    });
  }

  emitUserUpdate(userData) {
    this.emitToRoom('users', 'userUpdated', {
      data: userData,
      timestamp: new Date().toISOString()
    });
  }

  getConnectedClientsCount() {
    return this.connectedClients.size;
  }

  getConnectedClients() {
    return Array.from(this.connectedClients.values());
  }

  getIO() {
    return this.io;
  }
}

// Crear instancia singleton
const webSocketService = new WebSocketService();

module.exports = webSocketService;
