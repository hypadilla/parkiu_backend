const mongoose = require('mongoose');

const reservationDetailsSchema = new mongoose.Schema({
  reservedBy: {
    type: String,
    required: true,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > this.startTime;
      },
      message: 'endTime debe ser posterior a startTime'
    }
  },
  reason: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  }
}, {
  _id: false, // No necesitamos _id para subdocumentos
  versionKey: false
});

module.exports = reservationDetailsSchema;
