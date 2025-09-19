const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const { default: axios } = require("axios");
require("dotenv").config();

const options = {
  origin: JSON.parse(process.env.ALLOWED_ORIGINS),
  credentials: true,
};

const app = express();

app.get("/api/geo", async (req, res) => {
  try {
    const response = await axios.get("http://ip-api.com/json/");
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(express.json());
app.use(cors(options));
app.use(require("./Routes/index"));

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
