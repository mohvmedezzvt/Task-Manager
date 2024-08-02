const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username must not exceed 20 characters'],
  },
  bio: {
    type: String,
    maxlength: [100, 'Bio must not exceed 100 characters'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is invalid'],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

userSchema.pre('remove', async function (next) {
  await this.model('Task').deleteMany({ createdBy: this._id });
  await this.model('Project').deleteMany({ createdBy: this._id });

  await this.model('Task').updateMany(
    { assignedTo: this._id },
    { $unset: { assignedTo: '' } }
  );

  await this.model('Project').updateMany(
    { members: this._id },
    { $pull: { members: this._id } }
  );

  next();
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
