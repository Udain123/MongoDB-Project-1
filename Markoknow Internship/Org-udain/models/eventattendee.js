const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let eventAttendee = new Schema(
  {
    
    event: {
      type: String,
    },
    email: {
        type: String,
    },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "EventModel" },
    eventDate: {
      type: Date,
      required: true,
    },
    bookDate: {
        type: Date,
        required: true,
        default: Date.now(),
      },
    name:{
        type: String,
        required: true,
    },
    contact:{
        type: Number,
        default: null,
    }
  }
);

module.exports = mongoose.model("EventAttendee", eventAttendee);