const { RedisPubSub } = require('graphql-redis-subscriptions');

module.exports = new RedisPubSub({
  connection: {
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    // reconnect after upto 3000 milis
    retry_strategy: options => Math.max(options.attempt * 100, 3000)
  }
});
