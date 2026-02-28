const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  profiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  }],
  timezone: {
    type: String,
    required: [true, 'Timezone is required']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required'],
    validate: {
      validator: function (val) {
        return val > this.startTime;
      },
      message: 'End time must be after start time'
    }
  }
}, { timestamps: true });

eventSchema.index({ profiles: 1 });

module.exports = mongoose.model('Event', eventSchema);
