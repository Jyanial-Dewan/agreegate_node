const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  path: "/socket.io/",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const options = {
  origin: JSON.parse(process.env.ALLOWED_ORIGINS),
  credentials: true,
};

app.use(cookieParser());
app.use(express.json());
app.use(cors(options));

app.use(require("./Routes/index"));

// Import and initialize socket.io handlers
require("./Services/socket")(io);

server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
