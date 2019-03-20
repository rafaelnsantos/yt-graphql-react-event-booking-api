if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: `${process.cwd()}/.env.local.test` });
}

const mongoose = require('mongoose');
const app = require('./app');
const pubsub = require('./pubsub');

const User = require('./models/user');

beforeAll(() => app.listen());

beforeEach(() => User.create({ email: 'test@test.com', password: 'test' }));

afterEach(() => mongoose.connection.db.dropDatabase());

afterAll(async () => {
  await pubsub.close();
  await app.close();
  return mongoose.connection.close();
});
