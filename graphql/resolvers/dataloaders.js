const DataLoader = require('dataloader');

const Event = require('../../models/event');
const User = require('../../models/user');
const infoToProjection = require('../mongodb-projection');

exports.userLoader = info => {
  return Loader('user', User, info);
};

exports.eventLoader = eventLoader = info => {
  return Loader('event', Event, info);
};

const Loader = (name, Model, info) => {
  info = infoToProjection(info);
  if (JSON.stringify(this[`${name}Info`]) !== JSON.stringify(info)) {
    this[`${name}Loader`] = new DataLoader(async ids =>
      (await Model.find({ _id: { $in: ids } }, info)).sort(
        (a, b) => ids.indexOf(a._id.toString()) - ids.indexOf(b._id.toString())
      )
    );
    this[`${name}Info`] = info;
  }
  return this[`${name}Loader`];
};
