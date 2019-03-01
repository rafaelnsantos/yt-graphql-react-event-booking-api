const { makeExecutableSchema } = require('graphql-tools');
const glue = require('schemaglue');

const { schema, resolver } = glue('graphql');

module.exports = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolver
});
