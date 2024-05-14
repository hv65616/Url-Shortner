const mongoose = require("mongoose");
const urlschema = mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
    visitHistory: [
      {
        timestamps: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Url = mongoose.model("url", urlschema);
module.exports = Url;
