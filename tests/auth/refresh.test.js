import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';
import jwt from 'jsonwebtoken';

describe('Auth - Refresh Token', () => {
  let refreshToken, userPayload;
  const testUser = {
    name: 'Refresh Test',
    email: 'refresh_test@email.com',
    password: 'Senha@123',
    role: 'visual',
  };

  beforeAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
    const user = new User(testUser);
    await user.save();
    userPayload = { userId: user._id, role: user.role, name: user.name, email: user.email };
    refreshToken = jwt.sign(userPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: '2h' });
  });

  afterAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
  });

  it('deve gerar novo access token com refresh token válido', async () => {
    const res = await request(app).post('/api/auth/refresh').send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it('deve retornar erro se refresh token estiver ausente', async () => {
    const res = await request(app).post('/api/auth/refresh').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/refresh token.*obrigat/i);
  });

  it('deve retornar erro se refresh token for inválido', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'tokeninvalido' });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/inválido|expirado/i);
  });
});
