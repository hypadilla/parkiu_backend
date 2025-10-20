const mongoService = require('../database/mongoService');
const ParkingCell = require('../database/models/ParkingCell');
const User = require('../database/models/User');
const Recommendation = require('../database/models/Recommendation');

class ChangeStreamService {
  constructor() {
    this.changeStreams = new Map();
    this.io = null;
  }

  setSocketIO(io) {
    this.io = io;
  }

  async startChangeStreams() {
    try {
      if (!mongoService.isConnected) {
        await mongoService.connect();
      }

      // Change Stream para ParkingCells
      await this.startParkingCellChangeStream();
      
      // Change Stream para Users (opcional)
      await this.startUserChangeStream();
      
      // Change Stream para Recommendations
      await this.startRecommendationChangeStream();

      console.log('✅ Change Streams iniciados correctamente');
    } catch (error) {
      console.error('❌ Error iniciando Change Streams:', error);
      throw error;
    }
  }

  async startParkingCellChangeStream() {
    try {
      const changeStream = ParkingCell.watch([
        {
          $match: {
            $or: [
              { 'fullDocument.state': { $exists: true } },
              { 'updateDescription.updatedFields.state': { $exists: true } }
            ]
          }
        }
      ]);

      changeStream.on('change', (change) => {
        console.log('🔄 Cambio detectado en ParkingCell:', change.operationType);
        
        if (this.io) {
          this.handleParkingCellChange(change);
        }
      });

      changeStream.on('error', (error) => {
        console.error('❌ Error en ParkingCell Change Stream:', error);
      });

      this.changeStreams.set('parkingCells', changeStream);
    } catch (error) {
      console.error('❌ Error iniciando ParkingCell Change Stream:', error);
      throw error;
    }
  }

  async startUserChangeStream() {
    try {
      const changeStream = User.watch();

      changeStream.on('change', (change) => {
        console.log('🔄 Cambio detectado en User:', change.operationType);
        
        if (this.io) {
          this.handleUserChange(change);
        }
      });

      changeStream.on('error', (error) => {
        console.error('❌ Error en User Change Stream:', error);
      });

      this.changeStreams.set('users', changeStream);
    } catch (error) {
      console.error('❌ Error iniciando User Change Stream:', error);
      throw error;
    }
  }

  async startRecommendationChangeStream() {
    try {
      const changeStream = Recommendation.watch();

      changeStream.on('change', (change) => {
        console.log('🔄 Cambio detectado en Recommendation:', change.operationType);
        
        if (this.io) {
          this.handleRecommendationChange(change);
        }
      });

      changeStream.on('error', (error) => {
        console.error('❌ Error en Recommendation Change Stream:', error);
      });

      this.changeStreams.set('recommendations', changeStream);
    } catch (error) {
      console.error('❌ Error iniciando Recommendation Change Stream:', error);
      throw error;
    }
  }

  handleParkingCellChange(change) {
    const { operationType, fullDocument, documentKey, updateDescription } = change;
    
    let eventData = {
      operationType,
      id: documentKey._id.toString(),
      idStatic: fullDocument?.idStatic || updateDescription?.updatedFields?.idStatic,
      timestamp: new Date().toISOString()
    };

    switch (operationType) {
      case 'insert':
        eventData.data = fullDocument;
        this.io.emit('parkingCellCreated', eventData);
        break;
        
      case 'update':
        eventData.data = updateDescription.updatedFields;
        eventData.previousData = updateDescription.removedFields;
        this.io.emit('parkingCellUpdated', eventData);
        break;
        
      case 'delete':
        this.io.emit('parkingCellDeleted', eventData);
        break;
        
      case 'replace':
        eventData.data = fullDocument;
        this.io.emit('parkingCellReplaced', eventData);
        break;
    }

    // Evento general para cualquier cambio
    this.io.emit('parkingCellChange', eventData);
  }

  handleUserChange(change) {
    const { operationType, fullDocument, documentKey } = change;
    
    const eventData = {
      operationType,
      id: documentKey._id.toString(),
      timestamp: new Date().toISOString()
    };

    if (fullDocument) {
      eventData.data = {
        id: fullDocument._id.toString(),
        username: fullDocument.username,
        email: fullDocument.email,
        role: fullDocument.role
      };
    }

    this.io.emit('userChange', eventData);
  }

  handleRecommendationChange(change) {
    const { operationType, fullDocument, documentKey } = change;
    
    const eventData = {
      operationType,
      id: documentKey._id.toString(),
      timestamp: new Date().toISOString()
    };

    if (fullDocument) {
      eventData.data = {
        id: fullDocument._id.toString(),
        message: fullDocument.message,
        priority: fullDocument.priority,
        type: fullDocument.type,
        isActive: fullDocument.isActive
      };
    }

    this.io.emit('recommendationChange', eventData);
  }

  async stopChangeStreams() {
    try {
      for (const [name, changeStream] of this.changeStreams) {
        await changeStream.close();
        console.log(`✅ Change Stream ${name} cerrado`);
      }
      this.changeStreams.clear();
    } catch (error) {
      console.error('❌ Error cerrando Change Streams:', error);
      throw error;
    }
  }

  getChangeStreamStatus() {
    const status = {};
    for (const [name, changeStream] of this.changeStreams) {
      status[name] = {
        isOpen: changeStream.closed === false,
        readyState: changeStream.readyState
      };
    }
    return status;
  }
}

// Crear instancia singleton
const changeStreamService = new ChangeStreamService();

module.exports = changeStreamService;
