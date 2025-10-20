const ParkingCell = require('../database/models/ParkingCell');
const User = require('../database/models/User');
const Recommendation = require('../database/models/Recommendation');

class RealtimeEvents {
  constructor(io) {
    this.io = io;
  }

  // Emitir cuando se actualiza una celda específica
  async emitParkingCellUpdated(cellId, updateData) {
    try {
      const cell = await ParkingCell.findById(cellId).lean();
      if (cell && this.io) {
        this.io.emit('parkingCellUpdated', {
          id: cellId,
          data: cell,
          updateData,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('❌ Error emitiendo parkingCellUpdated:', error);
    }
  }

  // Emitir cuando se cambia el estado de una celda
  async emitParkingCellStatusChanged(cellId, oldStatus, newStatus) {
    try {
      const cell = await ParkingCell.findById(cellId).lean();
      if (cell && this.io) {
        this.io.emit('parkingCellStatusChanged', {
          id: cellId,
          oldStatus,
          newStatus,
          data: cell,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('❌ Error emitiendo parkingCellStatusChanged:', error);
    }
  }

  // Emitir cuando se crea una nueva celda
  async emitParkingCellCreated(cellId) {
    try {
      const cell = await ParkingCell.findById(cellId).lean();
      if (cell && this.io) {
        this.io.emit('parkingCellCreated', {
          id: cellId,
          data: cell,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('❌ Error emitiendo parkingCellCreated:', error);
    }
  }

  // Emitir cuando se reserva una celda
  async emitParkingCellReserved(cellId, reservationData) {
    try {
      const cell = await ParkingCell.findById(cellId).lean();
      if (cell && this.io) {
        this.io.emit('parkingCellReserved', {
          id: cellId,
          data: cell,
          reservation: reservationData,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('❌ Error emitiendo parkingCellReserved:', error);
    }
  }

  // Emitir cuando se cancela una reserva
  async emitParkingCellReservationCancelled(cellId) {
    try {
      const cell = await ParkingCell.findById(cellId).lean();
      if (cell && this.io) {
        this.io.emit('parkingCellReservationCancelled', {
          id: cellId,
          data: cell,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('❌ Error emitiendo parkingCellReservationCancelled:', error);
    }
  }

  // Emitir estadísticas actualizadas
  async emitStatisticsUpdated() {
    try {
      const stats = await this.getParkingStatistics();
      if (this.io) {
        this.io.emit('statisticsUpdated', {
          data: stats,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('❌ Error emitiendo statisticsUpdated:', error);
    }
  }

  // Obtener estadísticas de estacionamiento
  async getParkingStatistics() {
    try {
      const total = await ParkingCell.countDocuments();
      const disponible = await ParkingCell.countDocuments({ state: 'disponible' });
      const ocupado = await ParkingCell.countDocuments({ state: 'ocupado' });
      const reservado = await ParkingCell.countDocuments({ state: 'reservado' });
      const inhabilitado = await ParkingCell.countDocuments({ state: 'inhabilitado' });

      return {
        total,
        disponible,
        ocupado,
        reservado,
        inhabilitado,
        ocupancyRate: total > 0 ? ((ocupado + reservado) / total * 100).toFixed(2) : 0
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      return null;
    }
  }

  // Emitir notificación general
  emitNotification(type, message, data = null) {
    if (this.io) {
      this.io.emit('notification', {
        type,
        message,
        data,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Emitir alerta de sistema
  emitSystemAlert(level, message, data = null) {
    if (this.io) {
      this.io.emit('systemAlert', {
        level, // 'info', 'warning', 'error', 'critical'
        message,
        data,
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = RealtimeEvents;
