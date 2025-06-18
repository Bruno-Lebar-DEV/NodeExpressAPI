import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';
import jwt from 'jsonwebtoken';

describe('Security - JWT Token', () => {
  let token, expiredToken, userId;
  const testUser = {
    name: 'JWT Test',
    email: 'jwt_test@email.com',
    password: 'Senha@123',
    role: 'admin',
  };

  beforeAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
    const user = new User(testUser);
    await user.save();
    userId = user._id;
    token = jwt.sign(
      { userId, role: testUser.role, name: testUser.name, email: testUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    expiredToken = jwt.sign(
      { userId, role: testUser.role, name: testUser.name, email: testUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '-1s' }
    );
  });

  afterAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
  });

  it('deve negar acesso com token expirado', async () => {
    const res = await request(app)
      .get('/api/users/')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/expirado/i);
  });

  it('deve negar acesso com token malformado', async () => {
    const res = await request(app).get('/api/users/').set('Authorization', 'Bearer abc.def.ghi');
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/inválido|malformado/i);
  });
});
