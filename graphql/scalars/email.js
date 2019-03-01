const { GraphQLScalarType } = require('graphql');

const { isEmail } = require('validator');

const parseEmail = value => {
  if (isEmail(value)) {
    return value.toLowerCase();
  }
  throw new Error('Invalid email');
};

const parseLiteralEmail = ast => {
  return parseEmail(ast.value);
};

const Email = new GraphQLScalarType({
  name: 'Email',
  description: 'Email type.',
  serialize: parseEmail,
  parseValue: parseEmail,
  parseLiteral: parseLiteralEmail
});

exports.resolver = {
  Email
};
