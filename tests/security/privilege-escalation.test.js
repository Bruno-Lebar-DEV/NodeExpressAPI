import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';
import jwt from 'jsonwebtoken';

describe('Security - Privilege Escalation', () => {
  let userToken, adminToken, userId;
  const user = {
    name: 'User Privilege',
    email: 'user_privilege@email.com',
    password: 'Senha@123',
    role: 'visual',
  };
  const admin = {
    name: 'Admin Privilege',
    email: 'admin_privilege@email.com',
    password: 'Senha@123',
    role: 'admin',
  };

  beforeAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: user.email });
    await mongoose.connection.collection('users').deleteOne({ email: admin.email });
    const userDoc = new User(user);
    await userDoc.save();
    userId = userDoc._id;
    userToken = jwt.sign(
      { userId: userDoc._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const adminDoc = new User(admin);
    await adminDoc.save();
    adminToken = jwt.sign(
      { userId: adminDoc._id, role: admin.role, name: admin.name, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: user.email });
    await mongoose.connection.collection('users').deleteOne({ email: admin.email });
  });

  it('deve negar acesso de usuário comum a rota de admin', async () => {
    const res = await request(app).get('/api/users/').set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });

  it('deve negar alteração de role por usuário comum', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ role: 'admin' });
    expect(res.status).toBe(403);
  });
});
