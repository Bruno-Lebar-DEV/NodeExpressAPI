import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';
import jwt from 'jsonwebtoken';

describe('User - Remove', () => {
  let adminToken, userId;
  const adminUser = {
    name: 'Admin Remove',
    email: 'admin_remove@email.com',
    password: 'Senha@123',
    role: 'admin',
  };
  const userToRemove = {
    name: 'Usuário Remove',
    email: 'usuario_remove@email.com',
    password: 'Senha@123',
    role: 'visual',
  };

  beforeAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: adminUser.email });
    await mongoose.connection.collection('users').deleteOne({ email: userToRemove.email });
    const admin = new User(adminUser);
    await admin.save();
    adminToken = jwt.sign(
      { userId: admin._id, role: admin.role, name: admin.name, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const user = new User(userToRemove);
    await user.save();
    userId = user._id;
  });

  afterAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: adminUser.email });
    await mongoose.connection.collection('users').deleteOne({ email: userToRemove.email });
  });

  it('deve remover (soft delete) um usuário com sucesso', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deletado com sucesso/i);
  });

  it('deve retornar erro ao remover usuário inexistente', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/users/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/não encontrado|not found/i);
  });

  it('deve negar remoção de usuário sem token', async () => {
    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/token/i);
  });

  it('deve negar remoção de usuário com token inválido', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', 'Bearer tokeninvalido');
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/token/i);
  });
});
