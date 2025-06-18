import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { hashPassword, comparePassword } from '../services/passwordService.js';
dotenv.config();

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'editor', 'visual'],
      default: 'visual',
    },
    deleted: { type: Boolean, default: false }, // Soft delete
    deletedAt: { type: Date, default: null }, // Data de exclusão
  },
  { timestamps: true }
);

// Antes de salvar, normaliza e-mail e nome, e criptografa a senha
UserSchema.pre('save', async function (next) {
  if (this.isModified('email')) {
    this.email = this.email.trim().toLowerCase();
  }
  if (this.isModified('name')) {
    this.name = this.name.trim();
  }
  if (!this.isModified('password')) return next();
  this.password = await hashPassword(this.password);
  next();
});

// Método para comparar senha com pepper
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return comparePassword(candidatePassword, this.password);
};

// Remove a senha do objeto retornado por padrão
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', UserSchema);
export default User;
