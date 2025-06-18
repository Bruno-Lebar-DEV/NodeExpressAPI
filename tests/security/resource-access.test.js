import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';
import jwt from 'jsonwebtoken';

describe('Security - Resource Access', () => {
  let userToken, otherToken, taskId;
  const user = {
    name: 'User Resource',
    email: 'user_resource@email.com',
    password: 'Senha@123',
    role: 'admin',
  };
  const other = {
    name: 'Other Resource',
    email: 'other_resource@email.com',
    password: 'Senha@123',
    role: 'admin',
  };
  const newTask = {
    title: 'Task Resource',
    description: 'Task para acesso',
    status: 'pending',
  };

  beforeAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: user.email });
    await mongoose.connection.collection('users').deleteOne({ email: other.email });
    const userDoc = new User(user);
    await userDoc.save();
    userToken = jwt.sign(
      { userId: userDoc._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const otherDoc = new User(other);
    await otherDoc.save();
    otherToken = jwt.sign(
      { userId: otherDoc._id, role: other.role, name: other.name, email: other.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    // Cria a task com user
    const res = await request(app)
      .post('/api/tasks/')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newTask);
    taskId = res.body._id;
  });

  afterAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: user.email });
    await mongoose.connection.collection('users').deleteOne({ email: other.email });
  });

  it('não deve permitir visualizar task de outro usuário', async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${otherToken}`);
    expect(res.status).toBe(404);
  });

  it('não deve permitir remover task de outro usuário', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${otherToken}`);
    expect(res.status).toBe(404);
  });
});
