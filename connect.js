const mongoose = require("mongoose");
const connecttomongodb = (url) => {
  return mongoose.connect(url);
};
module.exports = connecttomongodb;
