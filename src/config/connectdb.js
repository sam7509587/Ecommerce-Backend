const DBURI = require('./index');
const mongoose = require('mongoose');
const connectDb = () => {
  return mongoose.connect(process.env.DBURI);
};
module.exports = connectDb;
