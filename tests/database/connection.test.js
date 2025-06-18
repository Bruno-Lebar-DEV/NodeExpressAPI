import mongoose from 'mongoose';
import connectDB from '../../src/config/database.js';

describe('Database Connection', () => {
  it('deve conectar ao banco de dados com sucesso', async () => {
    const conn = await connectDB();
    expect(conn.readyState).toBe(1); // 1 = connected
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
