import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';
import jwt from 'jsonwebtoken';

describe('Auth - Role Validation', () => {
  let adminToken, visualToken;
  const adminUser = {
    name: 'Admin Test',
    email: 'admin_test@email.com',
    password: 'Senha@123',
    role: 'admin',
  };
  const visualUser = {
    name: 'Visual Test',
    email: 'visual_test@email.com',
    password: 'Senha@123',
    role: 'visual',
  };

  beforeAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: adminUser.email });
    await mongoose.connection.collection('users').deleteOne({ email: visualUser.email });
    const admin = new User(adminUser);
    await admin.save();
    adminToken = jwt.sign(
      { userId: admin._id, role: admin.role, name: admin.name, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const visual = new User(visualUser);
    await visual.save();
    visualToken = jwt.sign(
      { userId: visual._id, role: visual.role, name: visual.name, email: visual.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: adminUser.email });
    await mongoose.connection.collection('users').deleteOne({ email: visualUser.email });
  });

  it('deve permitir acesso à listagem de usuários para admin', async () => {
    const res = await request(app).get('/api/users/').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });

  it('deve negar acesso à listagem de usuários para visual', async () => {
    const res = await request(app).get('/api/users/').set('Authorization', `Bearer ${visualToken}`);
    expect(res.status).toBe(403);
  });
});
