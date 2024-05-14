const ShortUniqueId = require("short-unique-id");
const Url = require("../modals/modal");
const generateNewShortUrl = async (req, res) => {
  const url = req.body.url;
  if (!url) {
    return res.status(400).json({
      error: "Url is required",
    });
  }
  const uid = new ShortUniqueId();
  const shortid = uid.randomUUID();
  await Url.create({
    shortId: shortid,
    redirectUrl: url,
    visitHistory: [],
  });
  res.json({
    id: shortid,
  });
};

const handleGetAnalytics = async (req, res) => {
  const shortid = req.params.shortId;
  const result = await Url.findOne({ shortId: shortid });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
};

module.exports = {generateNewShortUrl, handleGetAnalytics};
