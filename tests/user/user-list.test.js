import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';
import jwt from 'jsonwebtoken';

describe('User - List', () => {
  let adminToken;
  const adminUser = {
    name: 'Admin List',
    email: 'admin_list@email.com',
    password: 'Senha@123',
    role: 'admin',
  };

  const users = [
    { name: 'User1', email: 'user1@teste.com', password: 'Senha@123', role: 'admin' },
    { name: 'User2', email: 'user2@teste.com', password: 'Senha@123', role: 'visual' },
    { name: 'User3', email: 'user3@teste.com', password: 'Senha@123', role: 'editor' },
    { name: 'User4', email: 'user4@teste.com', password: 'Senha@123', role: 'editor' },
    { name: 'User5', email: 'user5@teste.com', password: 'Senha@123', role: 'visual' },
  ];

  beforeAll(async () => {
    await mongoose.connection.collection('users').deleteMany({ email: adminUser.email });
    await mongoose.connection.collection('users').deleteMany({ email: /user[1-5]@teste.com/ });
    const admin = new User(adminUser);
    await admin.save();
    await User.insertMany(users);
    const adminDb = await User.findOne({ email: adminUser.email });
    adminToken = jwt.sign(
      { userId: adminDb._id, role: adminDb.role, name: adminDb.name, email: adminDb.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await mongoose.connection.collection('users').deleteMany({ email: adminUser.email });
    await mongoose.connection.collection('users').deleteMany({ email: /user[1-5]@teste.com/ });
  });

  it('deve listar usuários com sucesso', async () => {
    const res = await request(app).get('/api/users/').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it('deve paginar usuários corretamente', async () => {
    const res = await request(app)
      .get('/api/users?page=1&limit=2')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.users.length).toBeLessThanOrEqual(2);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('page');
    expect(res.body).toHaveProperty('totalPages');
  });

  it('deve filtrar usuários por role', async () => {
    const res = await request(app)
      .get('/api/users?role=editor')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.users.every((u) => u.role === 'editor')).toBe(true);
  });

  it('deve buscar usuário por email', async () => {
    const res = await request(app)
      .get('/api/users?email=user2@teste.com')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.users.length).toBe(1);
    expect(res.body.users[0].email).toBe('user2@teste.com');
  });

  it('deve retornar erro ao listar usuários com parâmetros inválidos', async () => {
    const res = await request(app)
      .get('/api/users?page=-1&limit=999')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/página|limit|inválido|page|limit/i);
  });

  it('deve negar acesso à listagem de usuários sem token', async () => {
    const res = await request(app).get('/api/users/');
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/token/i);
  });

  it('deve negar acesso à listagem de usuários com token inválido', async () => {
    const res = await request(app).get('/api/users/').set('Authorization', 'Bearer tokeninvalido');
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/token/i);
  });
});
