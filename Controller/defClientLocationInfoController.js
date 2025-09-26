const prisma = require("../DB/db.config");

exports.addClientLocationInfo = async (req, res) => {
  const { device_id, user_id, latitude, longitude, connection_id } = req.body;

  try {
    const newClientLocationInfo = await prisma.def_client_location_info.create({
      data: {
        connection_id: connection_id,
        device_id: Number(device_id),
        user_id: Number(user_id),
        latitude: Number(latitude),
        longitude: Number(longitude),
        connection_time: new Date(),
      },
    });

    return res.status(201).json({
      message: "Client location added",
      result: newClientLocationInfo,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
