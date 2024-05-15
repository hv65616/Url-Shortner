const ShortUniqueId = require("short-unique-id");
const Url = require("../modals/modal");
const dns = require("dns");
const axios = require("axios");
const ipstackApiKey = "e1676168441287c9f4f064b5f0997ecb";
const getGeolocation = async (ip) => {
  try {
    const response = await axios.get(
      `http://api.ipstack.com/${ip}?access_key=${ipstackApiKey}`
    );
    // console.log(response.data);
    const { continent_name, region_name, city } = response.data;
    return {
      continent_name: continent_name,
      region_name: region_name,
      city: city,
    };
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    return {
      country: "Unknown",
      region: "Unknown",
      city: "Unknown",
    };
  }
};
const generateNewShortUrl = async (req, res) => {
  const url = req.body.url;
  if (!url) {
    return res.status(400).json({
      error: "Url is required",
    });
  }
  try {
    const hostname = new URL(url).hostname;
    const addresses = await dns.promises.lookup(hostname);
    const ipAddress = addresses.address;
    // console.log(addresses);
    const location = await getGeolocation(ipAddress);
    // console.log(location);
    const uid = new ShortUniqueId();
    const shortid = uid.randomUUID();
    await Url.create({
      shortId: shortid,
      redirectUrl: url,
      visitHistory: [],
      ipAddress: ipAddress,
      location: `${location.continent_name}, ${location.region_name}, ${location.city}`,
    });
    res.json({
      id: shortid,
    });
  } catch (error) {
    console.log("Error:-", error);
    res.status(500).json({
      error: error,
      msg: "Internal server error",
    });
  }
};

const handleGetAnalytics = async (req, res) => {
  const shortid = req.params.shortId;
  const result = await Url.findOne({ shortId: shortid });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
};

module.exports = { generateNewShortUrl, handleGetAnalytics };
