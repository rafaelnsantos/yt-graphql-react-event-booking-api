const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const { RedisPubSub } = require('graphql-redis-subscriptions');
const mongoose = require('mongoose');
const { createServer } = require('http');

const graphQLSchema = require('./schema');
const auth = require('./middleware/auth');
const debug = require('debug');

const PORT = process.env.PORT || 8000;
const app = express();

const pubsub = new RedisPubSub({
  connection: {
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    // reconnect after upto 3000 milis
    retry_strategy: options => Math.max(options.attempt * 100, 3000)
  }
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const server = new ApolloServer({
  schema: graphQLSchema,
  formatError(err) {
    debug('graphql:error')(err);
    return err;
  },
  context: ({ req, connection }) => ({
    userId: connection ? null : auth(req.headers.authorization),
    pubsub
  })
});

server.applyMiddleware({ app });

const httpServer = createServer(app);

server.installSubscriptionHandlers(httpServer);

mongoose
  .connect(`${process.env.MONGO_URI}?retryWrites=true`, {
    useNewUrlParser: true
  })
  .then(() => {
    httpServer.listen(PORT, () =>
      debug('server:info')(`listening on port ${PORT}`)
    );
  })
  .catch(err => {
    debug('server:error')(err);
  });
