const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
    require: true,
  },
  resetPasstoken:{
    type: String,
    default: null,
  },
  resetPassExpire:{
    type: Date,
    default: null,
  },
  bio:{
    type: String,
    default: "About",
    require: true,
  },
  markoknowPoints:{ 
    type: Number,
    default: 10,
    require: true,
  },
  events:{
    type: Map,
    of: Number,
    default:{meetups:0,workshops:0,sessions:0},
    require: true,
  },
  isAdmin: {
    default: false,
    type: Boolean,
  },
  eventNumber:{
    type: [String],
  },
  imagePath: {
    type: String,
    default: null,
  }
});

mongoose.model("User", userSchema);