const express = require("express");
const cors = require("cors");
require("dotenv").config();

const options = {
  origin: JSON.parse(process.env.ALLOWED_ORIGINS),
  credentials: true,
};

const app = express();

app.use(express.json());
app.use(cors(options));
app.use(require("./Routes/index"));

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
