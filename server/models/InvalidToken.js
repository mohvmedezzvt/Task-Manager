const mongoose = require('mongoose');

const InvalidTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const InvalidToken = mongoose.model('InvalidToken', InvalidTokenSchema);

module.exports = InvalidToken;
