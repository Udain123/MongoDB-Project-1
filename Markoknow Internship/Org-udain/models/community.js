const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let checkboxModel = new Schema(
  {
    
    email: {
      type: String,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    mobileNumber: {
      type: Number,
      required: true,
    },
    checkbox: {
      type: String,
    },
    date: { type: Date, default: Date.now },
  },
  {
    collection: "checkboxes",
  }
);

module.exports = mongoose.model("CheckboxModel", checkboxModel);
