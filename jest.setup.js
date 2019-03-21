if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: `${process.cwd()}/.env.local.test` });
}

const { connection } = require('./database');
const app = require('./app');
const pubsub = require('./pubsub');

const User = require('./models/user');

beforeAll(() => app.listen());

beforeEach(() => User.create({ email: 'test@test.com', password: 'test' }));

afterEach(() => connection.db.dropDatabase());

afterAll(async () => {
  await pubsub.close();
  await app.close();
  return connection.close();
});
