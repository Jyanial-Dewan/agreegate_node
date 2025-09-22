const { default: axios } = require("axios");

exports.getIPAdress = async (req, res) => {
  try {
    const response = await axios.get("http://ip-api.com/json/");
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
