const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido'],
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    trim: true,
    maxlength: 100
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER'
  },
  permissions: [{
    type: String,
    enum: ['CAN_VIEW_USERS', 'CAN_EDIT_USERS', 'CAN_DELETE_USERS', 'CAN_CREATE_RESERVATION', 'CAN_VIEW_RESERVATIONS']
  }],
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
userSchema.index({ role: 1 });
userSchema.index({ createdDate: -1 });

// Middleware para actualizar lastModifiedDate
userSchema.pre('save', function(next) {
  this.lastModifiedDate = new Date();
  next();
});

// Middleware para actualizar lastModifiedDate en updates
userSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ lastModifiedDate: new Date() });
  next();
});

module.exports = mongoose.model('User', userSchema);
