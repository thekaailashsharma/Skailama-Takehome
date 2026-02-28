const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Profile name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
