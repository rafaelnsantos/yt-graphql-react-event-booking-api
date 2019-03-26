const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');

const graphQLSchema = require('./schema');
const auth = require('./middleware/auth');
const debug = require('debug');
const pubsub = require('./pubsub');
const app = express();
const { models } = require('./database');
const dataloaders = require('./graphql/dataloaders');
const BookingService = require('./services/booking-service');
const EventService = require('./services/event-service');

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Recaptcha'
  );
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
  context: ({ req, connection }) =>
    connection
      ? { pubsub, dataloaders }
      : {
          userId: auth(req.headers.authorization),
          pubsub,
          models,
          dataloaders,
          services: {
            Booking: BookingService,
            Event: EventService
          },
          recaptchaData: {
            ip: req.ip,
            key: req.headers.recaptcha
          }
        }
});

server.applyMiddleware({ app });

const httpServer = createServer(app);

server.installSubscriptionHandlers(httpServer);

module.exports = httpServer;
