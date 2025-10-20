const mongoose = require('mongoose');
const reservationDetailsSchema = require('./ReservationDetails');

const parkingCellSchema = new mongoose.Schema({
  idStatic: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    index: true
  },
  state: {
    type: String,
    required: true,
    enum: ['disponible', 'ocupado', 'reservado', 'inhabilitado'],
    default: 'disponible'
  },
  reservationDetails: {
    type: reservationDetailsSchema,
    required: function() {
      return this.state === 'reservado';
    },
    validate: {
      validator: function(value) {
        if (this.state === 'reservado') {
          return value && value.reservedBy && value.startTime && value.endTime && value.reason;
        }
        return true;
      },
      message: 'reservationDetails es obligatorio cuando el estado es "reservado"'
    }
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    default: 'system'
  },
  lastModifiedDate: {
    type: Date,
    default: Date.now
  },
  lastModifiedBy: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: false, // Usamos nuestros propios campos de fecha
  versionKey: false
});

// Índices para mejor rendimiento
parkingCellSchema.index({ state: 1 });
parkingCellSchema.index({ 'reservationDetails.reservedBy': 1 });
parkingCellSchema.index({ lastModifiedDate: -1 });

// Middleware para actualizar lastModifiedDate
parkingCellSchema.pre('save', function(next) {
  this.lastModifiedDate = new Date();
  next();
});

// Middleware para actualizar lastModifiedDate en updates
parkingCellSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ lastModifiedDate: new Date() });
  next();
});

module.exports = mongoose.model('ParkingCell', parkingCellSchema);
