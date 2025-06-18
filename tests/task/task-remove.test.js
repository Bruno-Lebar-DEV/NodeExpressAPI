import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';
import jwt from 'jsonwebtoken';

describe('Task - Remove', () => {
  let adminToken, taskId;
  const adminUser = {
    name: 'Admin Task Remove',
    email: 'admin_task_remove@email.com',
    password: 'Senha@123',
    role: 'admin',
  };
  const newTask = {
    title: 'Task Remove',
    description: 'Task para remove',
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

  it('deve remover uma task com sucesso', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deletada com sucesso/i);
  });

  it('deve retornar 404 ao tentar remover uma task já removida', async () => {
    // Remove a primeira vez
    await request(app).delete(`/api/tasks/${taskId}`).set('Authorization', `Bearer ${adminToken}`);
    // Tenta remover novamente
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/não encontrada/i);
  });

  it('deve retornar erro ao remover task inexistente', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/tasks/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/não encontrada/i);
  });

  it('deve retornar erro ao remover task sem autorização', async () => {
    // Cria nova task
    const resCreate = await request(app)
      .post('/api/tasks/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Task sem auth', description: 'Teste' });
    const id = resCreate.body._id;
    const res = await request(app).delete(`/api/tasks/${id}`);
    expect([401, 403]).toContain(res.status);
  });
});
