const express = require("express");
const app = express();
const PORT = 3000;
const urlroute = require("./routes/url");
const connecttomongodb = require("./connect");
const Url = require("./modals/modal");
connecttomongodb("mongodb://localhost:27017/task1").then(() => {
  console.log("MongoDB Connected");
});
app.use(express.json());
app.use("/url", urlroute);
app.get("/:shortId", async (req, res) => {
  const shortid = req.params.shortId;
  const entry = await Url.findOneAndUpdate(
    {
      shortId: shortid,
    },
    {
      $push: {
        visitHistory: { timestamps: Date.now() },
      },
    }
  );
  res.redirect(entry.redirectUrl);
});
app.listen(PORT, (req, res) => {
  console.log(`server is running on ${PORT}`);
});
