const prisma = require("../DB/db.config");

exports.addClientInfo = async (req, res) => {
  const {
    user_id,
    browser_name,
    browser_version,
    browser_type,
    cpu_architecture,
    device_type,
    device_model,
    device_vendor,
    engine_name,
    engine_version,
    os_name,
    os_version,
    user_agent,
    ip_address,
    zip,
    timezone,
    region_name,
    region,
    ip_org,
    country_code,
    country,
    city,
    autonomus_system,
  } = req.body;

  try {
    const existingClient = await prisma.def_client_info.findFirst({
      where: {
        user_id: Number(user_id),
        ip_address,
        user_agent,
        ip_org,
        browser_name,
        browser_version,
      },
    });

    if (existingClient) {
      return res.status(200).json({
        message: "Client is already exist.",
        result: existingClient,
      });
    }
    const newClient = await prisma.def_client_info.create({
      data: {
        user_id: Number(user_id),
        browser_name: browser_name || "Undefined",
        browser_version: browser_version || "Undefined",
        browser_type: browser_type || "Undefined",
        cpu_architecture: cpu_architecture || "Undefined",
        device_type: device_type || "Undefined",
        device_model: device_model || "Undefined",
        device_vendor: device_vendor || "Undefined",
        engine_name: engine_name || "Undefined",
        engine_version: engine_version || "Undefined",
        os_name: os_name || "Undefined",
        os_version: os_version || "Undefined",
        user_agent: user_agent || "Undefined",
        ip_address: ip_address || "Undefined",
        zip: zip || "Undefined",
        timezone: timezone || "Undefined",
        region_name: region_name || "Undefined",
        region: region || "Undefined",
        ip_org: ip_org || "Undefined",
        country_code: country_code || "Undefined",
        country: country || "Undefined",
        city: city || "Undefined",
        autonomus_system: autonomus_system || "Undefined",
        engine_version: engine_version || "Undefined",
      },
    });

    return res.status(201).json({
      message: "Client added",
      result: newClient,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getClientInfo = async (req, res) => {
  const { user_id, device_id } = req.query;

  try {
    if (!device_id) {
      const infos = await prisma.def_client_info.findMany({
        where: {
          user_id: Number(user_id),
        },
      });

      const total = await prisma.def_client_info.count({
        where: {
          user_id: Number(user_id),
        },
      });
      return res.status(200).json({
        result: infos,
        totalData: total,
      });
    }

    if (device_id && user_id) {
      const info = await prisma.def_client_info.findFirst({
        where: {
          user_id: Number(user_id),
          device_id: Number(device_id),
        },
      });

      return res.status(200).json({
        result: info,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
