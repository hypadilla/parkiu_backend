const mongoose = require('mongoose');

const historicalRecordSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    min: 1
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    required: true,
    enum: ['disponible', 'ocupado', 'reservado', 'inhabilitado']
  },
  duration: {
    type: Number, // Duración en minutos
    default: function() {
      if (this.endTime && this.startTime) {
        return Math.round((this.endTime - this.startTime) / (1000 * 60));
      }
      return null;
    }
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false,
  versionKey: false
});

// Índices para mejor rendimiento
historicalRecordSchema.index({ id: 1 });
historicalRecordSchema.index({ status: 1 });
historicalRecordSchema.index({ startTime: -1 });
historicalRecordSchema.index({ endTime: 1 });
historicalRecordSchema.index({ createdDate: -1 });

// Middleware para calcular duración automáticamente
historicalRecordSchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60));
  }
  next();
});

module.exports = mongoose.model('HistoricalRecord', historicalRecordSchema);
