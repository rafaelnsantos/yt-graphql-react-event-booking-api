const { GraphQLScalarType } = require('graphql');

const { isISO8601 } = require('validator');

const parseISO8601 = value => {
  if (isISO8601(value)) {
    return value;
  }
  throw new Error('DateTime cannot represent an invalid ISO-8601 Date string');
};

const parseLiteralISO8601 = ast => {
  return parseISO8601(ast.value);
};

const serialize = value => {
  return new Date(value).toISOString();
};

const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'An ISO-8601 encoded UTC date string.',
  serialize: serialize,
  parseValue: parseISO8601,
  parseLiteral: parseLiteralISO8601
});

exports.resolver = {
  DateTime
};
