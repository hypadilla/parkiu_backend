const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  type: {
    type: String,
    enum: ['availability', 'capacity', 'maintenance', 'security', 'general'],
    default: 'general'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas por defecto
    },
    index: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: false,
  versionKey: false
});

// Índices para mejor rendimiento
recommendationSchema.index({ priority: 1 });
recommendationSchema.index({ type: 1 });
recommendationSchema.index({ isActive: 1 });
recommendationSchema.index({ createdDate: -1 });

// Índice TTL para limpiar recomendaciones expiradas
recommendationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Recommendation', recommendationSchema);
