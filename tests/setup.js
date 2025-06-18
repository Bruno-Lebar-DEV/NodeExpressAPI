import connectDB from '../src/config/database.js';
import mongoose from 'mongoose';

// Silencia logs do console durante os testes (sem depender do jest)
const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(async () => {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};

  await connectDB();
  // Limpa todas as coleções relevantes antes dos testes
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    await mongoose.connection.collections[collectionName].deleteMany({});
  }
});

afterAll(async () => {
  // Restaura os métodos originais do console
  console.log = originalLog;
  console.warn = originalWarn;
  console.error = originalError;

  // Limpa novamente após os testes
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    await mongoose.connection.collections[collectionName].deleteMany({});
  }
  await mongoose.connection.close();
});
