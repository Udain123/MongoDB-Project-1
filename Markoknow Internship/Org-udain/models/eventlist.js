const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventModel = new Schema({
  event: {
    type: String,
    required: true,
  },
  credit: {
    type: Number,
    required: true,
  },
  eventNumber: {
    type: String,
    required: true,
  },
  eventDate:{
    type: Date,
    default: null,
  },
  eventfee:{
    type: Number,
    default: 0,
    required: true,
  },
  posterPath: {
    type: String,
    default: null,
    required: true,
  },
  link: {
    type: String,
    default: null,
    required: true,
  },
});

module.exports = mongoose.model("EventModel", eventModel);