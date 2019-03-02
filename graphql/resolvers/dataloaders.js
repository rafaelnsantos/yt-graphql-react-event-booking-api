const DataLoader = require('dataloader');

const Event = require('../../models/event');
const User = require('../../models/user');
const infoToProjection = require('../mongodb-projection');

exports.userLoader = info => {
  info = infoToProjection(info);
  if (JSON.stringify(this.userInfo) !== JSON.stringify(info)) {
    this.userLoader = new DataLoader(ids =>
      User.find({ _id: { $in: ids } }, info)
    );
    this.userInfo = info;
  }
  return this.userLoader;
};

exports.eventLoader = eventLoader = info => {
  info = infoToProjection(info);
  if (JSON.stringify(this.eventInfo) !== JSON.stringify(info)) {
    this.eventLoader = new DataLoader(ids =>
      Event.find({ _id: { $in: ids } }, info)
    );
    this.eventInfo = info;
  }
  return this.eventLoader;
};
