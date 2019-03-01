const DataLoader = require('dataloader');

const Event = require('../../models/event');
const User = require('../../models/user');

const batchUsers = userIds => {
  return User.find({ _id: { $in: userIds } });
};

const batchEvents = eventIds => {
  return Event.find({ _id: { $in: eventIds } });
};

exports.userLoader = new DataLoader(batchUsers, {
  cacheKeyFn: key => key.toString()
});

exports.eventLoader = new DataLoader(batchEvents, {
  cacheKeyFn: key => key.toString()
});
