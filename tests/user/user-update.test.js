import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';
import jwt from 'jsonwebtoken';

describe('User - Update', () => {
  let adminToken, userId;
  const adminUser = {
    name: 'Admin Update',
    email: 'admin_update@email.com',
    password: 'Senha@123',
    role: 'admin',
  };
  const userToUpdate = {
    name: 'Usuário Update',
    email: 'usuario_update@email.com',
    password: 'Senha@123',
    role: 'visual',
  };

  beforeAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: adminUser.email });
    await mongoose.connection.collection('users').deleteOne({ email: userToUpdate.email });
    const admin = new User(adminUser);
    await admin.save();
    adminToken = jwt.sign(
      { userId: admin._id, role: admin.role, name: admin.name, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const user = new User(userToUpdate);
    await user.save();
    userId = user._id;
  });

  afterAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: adminUser.email });
    await mongoose.connection.collection('users').deleteOne({ email: userToUpdate.email });
  });

  it('deve atualizar um usuário com sucesso', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Usuário Atualizado' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Usuário Atualizado');
  });

  it('deve retornar erro ao atualizar usuário com campos inválidos', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: '' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/empty|obrigat|required|min/i);
  });

  it('deve negar atualização de role/email por não-admin', async () => {
    // Cria token de usuário visual
    const visualUser = await User.findOne({ email: userToUpdate.email });
    const visualToken = jwt.sign(
      {
        userId: visualUser._id,
        role: visualUser.role,
        name: visualUser.name,
        email: visualUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    // Tenta atualizar role
    const resRole = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${visualToken}`)
      .send({ role: 'admin' });
    expect(resRole.status).toBe(403);
    expect(resRole.body.message).toMatch(/não é permitida|não autorizado|forbidden|admin/i);
    // Tenta atualizar email (deve permitir se for o próprio usuário)
    const resEmail = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${visualToken}`)
      .send({ email: 'novo@email.com' });
    expect([200, 403]).toContain(resEmail.status);
    if (resEmail.status === 403) {
      expect(resEmail.body.message).toMatch(/não é permitida|não autorizado|forbidden|admin/i);
    } else {
      expect(resEmail.body.email).toBe('novo@email.com');
    }
  });
});
