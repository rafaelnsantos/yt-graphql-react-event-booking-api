if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: `${process.cwd()}/.env.local.test` });
}

const mongoose = require('mongoose');
const app = require('./app');
const pubsub = require('./pubsub');

const User = require('./models/user');

const PORT = process.env.PORT || 5000;

beforeAll(() => app.listen(PORT));

beforeEach(() => User.create({ email: 'test@test.com', password: 'test' }));

afterEach(() => mongoose.connection.db.dropDatabase());

afterAll(async () => {
  await pubsub.close();
  await app.close();
  return mongoose.connection.close();
});
