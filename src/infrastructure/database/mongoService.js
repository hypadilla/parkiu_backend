const mongoose = require('mongoose');

class MongoService {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    try {
      if (this.isConnected) {
        console.log('MongoDB ya está conectado');
        return;
      }

      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/parkiu';
      
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10, // Mantener hasta 10 conexiones
        serverSelectionTimeoutMS: 5000, // Timeout después de 5s
        socketTimeoutMS: 45000, // Cerrar sockets después de 45s
        bufferMaxEntries: 0, // Deshabilitar mongoose buffering
        bufferCommands: false, // Deshabilitar mongoose buffering
      });

      this.isConnected = true;
      console.log('✅ MongoDB conectado exitosamente');

      // Manejar eventos de conexión
      mongoose.connection.on('error', (err) => {
        console.error('❌ Error de MongoDB:', err);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB desconectado');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconectado');
        this.isConnected = true;
      });

    } catch (error) {
      console.error('❌ Error conectando a MongoDB:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('🔌 MongoDB desconectado');
    } catch (error) {
      console.error('❌ Error desconectando MongoDB:', error);
      throw error;
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
  }

  // Método para obtener la instancia de mongoose (para Change Streams)
  getConnection() {
    return mongoose.connection;
  }
}

// Crear instancia singleton
const mongoService = new MongoService();

module.exports = mongoService;
