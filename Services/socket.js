const { default: axios } = require("axios");
const prisma = require("../DB/db.config");
let users = {};
let devices = {};
const nodeUrl = process.env.NODE_URL;
const socket = (io) => {
  io.use(async (socket, next) => {
    const user_id = Number(socket.handshake.query.user_id);
    const device_id = Number(socket.handshake.query.device_id);

    if (!user_id || user_id === 0 || !device_id || device_id === 0) {
      return;
    } else {
      socket.join(user_id);

      if (!users[user_id]) {
        users[user_id] = [];
      }
      if (!devices[device_id]) {
        devices[device_id] = [];
      }
      users[user_id].push(socket.id);
      devices[device_id].push(socket.id);
      next();
      console.log(
        `device: ${device_id} connected in room: ${user_id} with socket id ${socket.id}`
      );
    }
  });

  io.on("connection", (socket) => {
    socket.on(
      "ClientLocation",
      async ({ latitude, longitude, device_id, user_id }) => {
        try {
          await prisma.def_client_info.update({
            where: {
              device_id: Number(device_id),
              user_id: Number(user_id),
            },
            data: {
              is_active: true,
            },
          });
          await axios.post(`${nodeUrl}/api/client_location_info`, {
            connection_id: socket.id,
            device_id,
            user_id,
            latitude,
            longitude,
          });
        } catch (error) {
          console.log(error);
        }
      }
    );

    socket.on("disconnect", async () => {
      const connection = await prisma.def_client_location_info.findUnique({
        where: {
          connection_id: socket.id,
        },
      });
      if (connection) {
        await prisma.def_client_info.update({
          where: {
            device_id: connection.device_id,
          },
          data: {
            is_active: false,
          },
        });
        await prisma.def_client_location_info.update({
          where: {
            connection_id: connection.connection_id,
          },
          data: {
            disconnection_time: new Date(),
          },
        });
      }
    });
  });
};

module.exports = socket;
