const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQLSchema = require('./schema');
const auth = require('./middleware/auth');

const app = express();

const debug = require('debug');

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth);

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQLSchema,
    graphiql: true,
    formatError(err) {
      debug('graphql:error')(err);
      return err;
    }
  })
);

mongoose
  .connect(`${process.env.MONGO_URI}?retryWrites=true`, {
    useNewUrlParser: true
  })
  .then(() => {
    app.listen(8000, () => debug('server:info')('listening on port 8000'));
  })
  .catch(err => {
    debug('server:error')(err);
  });
