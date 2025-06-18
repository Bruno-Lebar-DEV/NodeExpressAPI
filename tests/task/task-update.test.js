import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';
import jwt from 'jsonwebtoken';

describe('Task - Update', () => {
  let adminToken, taskId;
  const adminUser = {
    name: 'Admin Task Update',
    email: 'admin_task_update@email.com',
    password: 'Senha@123',
    role: 'admin',
  };
  const newTask = {
    title: 'Task Update',
    description: 'Task para update',
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

  it('deve atualizar uma task com sucesso', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Task Atualizada' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Task Atualizada');
  });

  it('deve retornar 404 ao tentar atualizar uma task inexistente', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/tasks/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Update Inexistente' });
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/não encontrada/i);
  });

  it('deve retornar erro ao atualizar task com campos inválidos', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: '' }); // título vazio
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('O título é obrigatório');
  });

  it('deve retornar erro ao atualizar task sem autorização', async () => {
    const res = await request(app).put(`/api/tasks/${taskId}`).send({ title: 'Sem auth' });
    expect([401, 403]).toContain(res.status);
  });
});
