import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';
import jwt from 'jsonwebtoken';

describe('User - Create', () => {
  let adminToken;
  const adminUser = {
    name: 'Admin Create',
    email: 'admin_create@email.com',
    password: 'Senha@123',
    role: 'admin',
  };
  const newUser = {
    name: 'Novo Usuário',
    email: 'novo_usuario_create@email.com',
    password: 'Senha@123',
    role: 'visual',
  };

  beforeAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: adminUser.email });
    await mongoose.connection.collection('users').deleteOne({ email: newUser.email });
    const admin = new User(adminUser);
    await admin.save();
    adminToken = jwt.sign(
      { userId: admin._id, role: admin.role, name: admin.name, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: adminUser.email });
    await mongoose.connection.collection('users').deleteOne({ email: newUser.email });
  });

  it('deve criar um novo usuário com sucesso', async () => {
    const res = await request(app)
      .post('/api/users/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newUser);
    expect(res.status).toBe(201);
    expect(res.body.email).toBe(newUser.email);
  });

  it('deve retornar erro ao criar usuário com campos obrigatórios ausentes', async () => {
    const res = await request(app)
      .post('/api/users/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ email: '', password: '' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/required|obrigat/i);
  });

  it('deve retornar erro ao criar usuário com e-mail duplicado', async () => {
    // Cria o usuário pela primeira vez
    await request(app)
      .post('/api/users/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newUser);
    // Tenta criar novamente
    const res = await request(app)
      .post('/api/users/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newUser);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/E11000|e-?mail.+existe|duplicado|cadastrado/i);
  });

  it('deve retornar erro ao criar usuário com senha fraca', async () => {
    const res = await request(app)
      .post('/api/users/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...newUser, email: 'fraca@email.com', password: '123' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/senha.+forte|fraca|mínimo/i);
  });
});
