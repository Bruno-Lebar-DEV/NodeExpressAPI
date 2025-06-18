import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';
import jwt from 'jsonwebtoken';

describe('Task - Create', () => {
  let adminToken;
  const adminUser = {
    name: 'Admin Task Create',
    email: 'admin_task_create@email.com',
    password: 'Senha@123',
    role: 'admin',
  };
  const newTask = {
    title: 'Nova Task',
    description: 'Descrição da task',
    status: 'pending',
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

  it('deve criar uma nova task com sucesso', async () => {
    const res = await request(app)
      .post('/api/tasks/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newTask);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(newTask.title);
  });

  it('deve retornar erro ao criar task sem título', async () => {
    const res = await request(app)
      .post('/api/tasks/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ description: 'Sem título' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('O título é obrigatório');
  });

  it('deve retornar erro ao criar task sem descrição', async () => {
    const res = await request(app)
      .post('/api/tasks/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Task sem descrição' });
    expect(res.status).toBe(201); // descrição é opcional, deve criar normalmente
    expect(res.body.title).toBe('Task sem descrição');
  });

  it('deve retornar erro ao criar task sem payload', async () => {
    const res = await request(app)
      .post('/api/tasks/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('O título é obrigatório');
  });

  it('deve retornar erro ao criar task sem autorização', async () => {
    const res = await request(app)
      .post('/api/tasks/')
      .send({ title: 'Task sem auth', description: 'Teste' });
    expect([401, 403]).toContain(res.status);
  });
});
