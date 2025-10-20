const HistoricalRecord = require('../database/models/HistoricalRecord');

class HistoricalRecordRepository {
  async getAll() {
    try {
      const records = await HistoricalRecord.find()
        .sort({ createdDate: -1 })
        .lean();

      return records;
    } catch (error) {
      throw new Error(`Error obteniendo registros históricos: ${error.message}`);
    }
  }

  async create(recordData) {
    try {
      const record = new HistoricalRecord(recordData);
      const savedRecord = await record.save();
      return savedRecord.toObject();
    } catch (error) {
      throw new Error(`Error creando registro histórico: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const record = await HistoricalRecord.findById(id).lean();
      return record;
    } catch (error) {
      throw new Error(`Error obteniendo registro histórico por ID: ${error.message}`);
    }
  }

  async getByCellId(cellId) {
    try {
      const records = await HistoricalRecord.find({ id: cellId })
        .sort({ startTime: -1 })
        .lean();

      return records;
    } catch (error) {
      throw new Error(`Error obteniendo registros por celda: ${error.message}`);
    }
  }

  async updateLastOpenRecord(cellId, endTime) {
    try {
      const record = await HistoricalRecord.findOneAndUpdate(
        { 
          id: cellId, 
          endTime: null 
        },
        { 
          endTime,
          duration: Math.round((endTime - new Date()) / (1000 * 60))
        },
        { 
          sort: { startTime: -1 },
          new: true 
        }
      ).lean();

      return record;
    } catch (error) {
      throw new Error(`Error actualizando último registro abierto: ${error.message}`);
    }
  }

  async getOpenRecords() {
    try {
      const records = await HistoricalRecord.find({
        endTime: null
      })
      .sort({ startTime: -1 })
      .lean();

      return records;
    } catch (error) {
      throw new Error(`Error obteniendo registros abiertos: ${error.message}`);
    }
  }

  async getByDateRange(startDate, endDate) {
    try {
      const records = await HistoricalRecord.find({
        startTime: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .sort({ startTime: -1 })
      .lean();

      return records;
    } catch (error) {
      throw new Error(`Error obteniendo registros por rango de fecha: ${error.message}`);
    }
  }

  async getByStatus(status) {
    try {
      const records = await HistoricalRecord.find({ status })
        .sort({ startTime: -1 })
        .lean();

      return records;
    } catch (error) {
      throw new Error(`Error obteniendo registros por estado: ${error.message}`);
    }
  }

  async getStatistics(cellId = null) {
    try {
      const matchStage = cellId ? { id: cellId } : {};
      
      const stats = await HistoricalRecord.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalDuration: { $sum: '$duration' },
            avgDuration: { $avg: '$duration' }
          }
        }
      ]);

      return stats;
    } catch (error) {
      throw new Error(`Error obteniendo estadísticas: ${error.message}`);
    }
  }

  async deleteOldRecords(daysOld = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await HistoricalRecord.deleteMany({
        createdDate: { $lt: cutoffDate }
      });

      return result.deletedCount;
    } catch (error) {
      throw new Error(`Error eliminando registros antiguos: ${error.message}`);
    }
  }

  async count() {
    try {
      return await HistoricalRecord.countDocuments();
    } catch (error) {
      throw new Error(`Error contando registros históricos: ${error.message}`);
    }
  }
}

module.exports = HistoricalRecordRepository;