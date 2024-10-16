import { Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcrypt';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project',
  }],
  incorrectAttemptsLeft:{
    type: Number,
    default: 5,
  },
  isBlocked: {
    type: Boolean,
    default: false 
  },
  blockExpires:{
    type: Date,
  }
}, {
  timestamps: true
});


UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});


UserSchema.methods.comparePassword = async function (password) {
  return await compare(password, this.password);
};

const User = model('User', UserSchema);
export default User;
