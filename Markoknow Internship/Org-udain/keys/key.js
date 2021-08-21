require("dotenv").config("../.env");

module.exports = {
  MONGOURI: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ic0bh.mongodb.net/${process.env.DB_DATABSE}?retryWrites=true&w=majority`,
  JWT_SECRET: process.env.JWT_SECRET,
};