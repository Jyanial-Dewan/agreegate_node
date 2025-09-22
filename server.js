const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const { default: axios } = require("axios");
const cookieParser = require("cookie-parser");
const path = require("path");
const multer = require("multer");

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

app.use(cookieParser());
app.use(express.json());
app.use(cors(options));
app.use(require("./Routes/index"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
  next();
});
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
