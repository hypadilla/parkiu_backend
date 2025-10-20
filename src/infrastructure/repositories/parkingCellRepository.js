const ParkingCell = require('../database/models/ParkingCell');
const ParkingCellMapper = require('../../core/services/mapping/parkingCellMapper');

class ParkingCellRepository {
  async bulkStatusUpdate(cells) {
    try {
      const results = [];
      const bulkOps = [];

      for (const cell of cells) {
        const { idStatic, state } = cell;
        
        bulkOps.push({
          updateOne: {
            filter: { idStatic },
            update: {
              state,
              lastModifiedDate: new Date(),
              lastModifiedBy: 'system'
            },
            upsert: true
          }
        });
      }

      const bulkResult = await ParkingCell.bulkWrite(bulkOps);
      
      // Preparar resultados
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        results.push({
          idStatic: cell.idStatic,
          status: 'success',
          docId: bulkResult.upsertedIds[i] || 'updated'
        });
      }

      return results;
    } catch (error) {
      throw new Error(`Error en actualización masiva: ${error.message}`);
    }
  }

  async upsertByStaticId(idStatic, newState, reservationDetails = null) {
    try {
      const updateData = {
        state: newState,
        lastModifiedDate: new Date(),
        lastModifiedBy: 'system'
      };

      if (newState === 'reservado' && reservationDetails) {
        updateData.reservationDetails = reservationDetails;
      }

      const options = {
        upsert: true,
        new: true,
        runValidators: true
      };

      const cell = await ParkingCell.findOneAndUpdate(
        { idStatic },
        updateData,
        options
      ).lean();

      return cell._id.toString();
    } catch (error) {
      throw new Error(`Error upsertando celda: ${error.message}`);
    }
  }

  async getByIdStatic(idStatic) {
    try {
      const cell = await ParkingCell.findOne({ idStatic }).lean();
      return cell ? ParkingCellMapper.toDomain(cell) : null;
    } catch (error) {
      throw new Error(`Error obteniendo celda por idStatic: ${error.message}`);
    }
  }

  async getAll() {
    try {
      const cells = await ParkingCell.find().sort({ idStatic: 1 }).lean();
      return cells.map(cell => ParkingCellMapper.toDomain(cell));
    } catch (error) {
      throw new Error(`Error obteniendo todas las celdas: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const cell = await ParkingCell.findById(id).lean();
      return cell ? ParkingCellMapper.toDomain(cell) : null;
    } catch (error) {
      throw new Error(`Error obteniendo celda por ID: ${error.message}`);
    }
  }

  async create(cellData) {
    try {
      const cell = new ParkingCell(cellData);
      const savedCell = await cell.save();
      return ParkingCellMapper.toDomain(savedCell.toObject());
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Celda con este idStatic ya existe');
      }
      throw new Error(`Error creando celda: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      const cell = await ParkingCell.findByIdAndUpdate(
        id,
        { ...updateData, lastModifiedDate: new Date() },
        { new: true, runValidators: true }
      ).lean();

      if (!cell) {
        throw new Error('Celda no encontrada');
      }

      return ParkingCellMapper.toDomain(cell);
    } catch (error) {
      throw new Error(`Error actualizando celda: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const cell = await ParkingCell.findByIdAndDelete(id);
      if (!cell) {
        throw new Error('Celda no encontrada');
      }
      return true;
    } catch (error) {
      throw new Error(`Error eliminando celda: ${error.message}`);
    }
  }

  async getByState(state) {
    try {
      const cells = await ParkingCell.find({ state }).sort({ idStatic: 1 }).lean();
      return cells.map(cell => ParkingCellMapper.toDomain(cell));
    } catch (error) {
      throw new Error(`Error obteniendo celdas por estado: ${error.message}`);
    }
  }

  async getReservedByUser(userId) {
    try {
      const cells = await ParkingCell.find({
        state: 'reservado',
        'reservationDetails.reservedBy': userId
      }).sort({ idStatic: 1 }).lean();

      return cells.map(cell => ParkingCellMapper.toDomain(cell));
    } catch (error) {
      throw new Error(`Error obteniendo celdas reservadas por usuario: ${error.message}`);
    }
  }

  async countByState(state) {
    try {
      return await ParkingCell.countDocuments({ state });
    } catch (error) {
      throw new Error(`Error contando celdas por estado: ${error.message}`);
    }
  }

  async getAvailableCells() {
    try {
      const cells = await ParkingCell.find({ state: 'disponible' })
        .sort({ idStatic: 1 })
        .lean();
      
      return cells.map(cell => ParkingCellMapper.toDomain(cell));
    } catch (error) {
      throw new Error(`Error obteniendo celdas disponibles: ${error.message}`);
    }
  }
}

module.exports = ParkingCellRepository;