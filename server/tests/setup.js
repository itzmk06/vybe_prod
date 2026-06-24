const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Set env vars BEFORE importing any app code
process.env.NODE_ENV = 'test';
process.env.ACCESS_TOKEN_SECRET = 'test-access-secret-key-for-jwt-signing-2026';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret-key-for-jwt-signing-2026';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  console.log('MongoDB Memory Server connected at', mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
  console.log('MongoDB Memory Server stopped');
});

afterEach(async () => {
  // Clean all collections between tests
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});