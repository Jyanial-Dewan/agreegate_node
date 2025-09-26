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

exports.getClientLocationInfo = async (req, res) => {
  const { device_id, user_id, page = 1, limit = 8 } = req.query;

  try {
    if (!device_id || !user_id) {
      return res.status(400).json({
        message: "Device ID and User ID fields are required",
      });
    }
    const connections = await prisma.def_client_location_info.findMany({
      where: {
        user_id: Number(user_id),
        device_id: Number(device_id),
      },
      orderBy: {
        created_at: "desc",
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const total = await prisma.def_client_location_info.count({
      where: {
        user_id: Number(user_id),
        device_id: Number(device_id),
      },
    });

    return res.status(200).json({
      result: connections,
      totalData: total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
