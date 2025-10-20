const Recommendation = require('../database/models/Recommendation');

class RecommendationRepository {
  async getRecommendations() {
    try {
      const recommendations = await Recommendation.find({
        isActive: true,
        expiresAt: { $gt: new Date() }
      })
      .sort({ priority: -1, createdDate: -1 })
      .lean();

      return recommendations;
    } catch (error) {
      throw new Error(`Error obteniendo recomendaciones: ${error.message}`);
    }
  }

  async create(recommendationData) {
    try {
      const recommendation = new Recommendation(recommendationData);
      const savedRecommendation = await recommendation.save();
      return savedRecommendation.toObject();
    } catch (error) {
      throw new Error(`Error creando recomendación: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const recommendation = await Recommendation.findById(id).lean();
      return recommendation;
    } catch (error) {
      throw new Error(`Error obteniendo recomendación por ID: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      const recommendation = await Recommendation.findByIdAndUpdate(
        id,
        { ...updateData, lastModifiedDate: new Date() },
        { new: true, runValidators: true }
      ).lean();

      if (!recommendation) {
        throw new Error('Recomendación no encontrada');
      }

      return recommendation;
    } catch (error) {
      throw new Error(`Error actualizando recomendación: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const recommendation = await Recommendation.findByIdAndDelete(id);
      if (!recommendation) {
        throw new Error('Recomendación no encontrada');
      }
      return true;
    } catch (error) {
      throw new Error(`Error eliminando recomendación: ${error.message}`);
    }
  }

  async getByPriority(priority) {
    try {
      const recommendations = await Recommendation.find({
        priority,
        isActive: true,
        expiresAt: { $gt: new Date() }
      })
      .sort({ createdDate: -1 })
      .lean();

      return recommendations;
    } catch (error) {
      throw new Error(`Error obteniendo recomendaciones por prioridad: ${error.message}`);
    }
  }

  async getByType(type) {
    try {
      const recommendations = await Recommendation.find({
        type,
        isActive: true,
        expiresAt: { $gt: new Date() }
      })
      .sort({ priority: -1, createdDate: -1 })
      .lean();

      return recommendations;
    } catch (error) {
      throw new Error(`Error obteniendo recomendaciones por tipo: ${error.message}`);
    }
  }

  async deactivateExpired() {
    try {
      const result = await Recommendation.updateMany(
        { 
          isActive: true,
          expiresAt: { $lte: new Date() }
        },
        { isActive: false }
      );

      return result.modifiedCount;
    } catch (error) {
      throw new Error(`Error desactivando recomendaciones expiradas: ${error.message}`);
    }
  }

  async count() {
    try {
      return await Recommendation.countDocuments({
        isActive: true,
        expiresAt: { $gt: new Date() }
      });
    } catch (error) {
      throw new Error(`Error contando recomendaciones: ${error.message}`);
    }
  }

  async getAll() {
    try {
      const recommendations = await Recommendation.find()
        .sort({ priority: -1, createdDate: -1 })
        .lean();

      return recommendations;
    } catch (error) {
      throw new Error(`Error obteniendo todas las recomendaciones: ${error.message}`);
    }
  }
}

module.exports = RecommendationRepository;
