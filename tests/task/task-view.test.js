import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';
import jwt from 'jsonwebtoken';

describe('Task - View', () => {
  let adminToken, taskId;
  const adminUser = {
    name: 'Admin Task View',
    email: 'admin_task_view@email.com',
    password: 'Senha@123',
    role: 'admin',
  };
  const newTask = {
    title: 'Task View',
    description: 'Task para view',
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
    // Cria a task
    const res = await request(app)
      .post('/api/tasks/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newTask);
    taskId = res.body._id;
  });

  afterAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: adminUser.email });
  });

  it('deve buscar uma task pelo id com sucesso', async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(taskId);
  });

  it('não deve permitir visualizar task de outro usuário', async () => {
    // Cria outro usuário
    const otherUser = {
      name: 'Outro Usuário',
      email: 'other_task_view@email.com',
      password: 'Senha@123',
      role: 'admin',
    };
    await mongoose.connection.collection('users').deleteOne({ email: otherUser.email });
    const other = new User(otherUser);
    await other.save();
    const otherToken = jwt.sign(
      { userId: other._id, role: other.role, name: other.name, email: other.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${otherToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/não encontrada/i);
    await mongoose.connection.collection('users').deleteOne({ email: otherUser.email });
  });

  it('deve retornar erro ao buscar task inexistente', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/tasks/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/não encontrada/i);
  });

  it('deve retornar erro ao buscar task sem autorização', async () => {
    const res = await request(app).get(`/api/tasks/${taskId}`);
    expect([401, 403]).toContain(res.status);
  });
});
