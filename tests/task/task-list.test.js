import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';
import jwt from 'jsonwebtoken';

describe('Task - List', () => {
  let adminToken;
  const adminUser = {
    name: 'Admin Task List',
    email: 'admin_task_list@email.com',
    password: 'Senha@123',
    role: 'admin',
  };

  beforeAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: adminUser.email });
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
  });

  it('deve listar tasks com sucesso', async () => {
    const res = await request(app).get('/api/tasks/').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });

  it('deve retornar erro ao listar tasks com página inválida', async () => {
    const res = await request(app)
      .get('/api/tasks?page=-1')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/page/i);
  });

  it('deve filtrar tasks por status', async () => {
    // Cria tasks com status diferentes
    await request(app)
      .post('/api/tasks/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Task pendente', completed: false });
    await request(app)
      .post('/api/tasks/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Task concluída', completed: true });
    const res = await request(app)
      .get('/api/tasks?status=completed')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.tasks.every((t) => t.completed === true)).toBe(true);
  });

  it('deve buscar tasks por termo no título', async () => {
    // Cria a task e aguarda a resposta
    const createRes = await request(app)
      .post('/api/tasks/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Buscar por termo', description: 'Teste busca' });
    expect(createRes.status).toBe(201);
    // Busca imediatamente após criar
    const res = await request(app)
      .get('/api/tasks?search=termo')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.tasks.some((t) => t.title && t.title.toLowerCase().includes('termo'))).toBe(
      true
    );
  });
});
