import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';
import jwt from 'jsonwebtoken';

describe('User - View', () => {
  let adminToken, userId;
  const adminUser = {
    name: 'Admin View',
    email: 'admin_view@email.com',
    password: 'Senha@123',
    role: 'admin',
  };
  const userToView = {
    name: 'Usuário View',
    email: 'usuario_view@email.com',
    password: 'Senha@123',
    role: 'visual',
  };

  beforeAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: adminUser.email });
    await mongoose.connection.collection('users').deleteOne({ email: userToView.email });
    const admin = new User(adminUser);
    await admin.save();
    adminToken = jwt.sign(
      { userId: admin._id, role: admin.role, name: admin.name, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const user = new User(userToView);
    await user.save();
    userId = user._id;
  });

  afterAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: adminUser.email });
    await mongoose.connection.collection('users').deleteOne({ email: userToView.email });
  });

  it('deve buscar um usuário pelo id com sucesso', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(String(userId));
  });

  it('deve retornar erro ao buscar usuário inexistente', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/users/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/não encontrado|not found/i);
  });

  it('deve negar acesso à visualização de usuário sem token', async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/token/i);
  });

  it('deve negar acesso à visualização de usuário com token inválido', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', 'Bearer tokeninvalido');
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/token/i);
  });
});
