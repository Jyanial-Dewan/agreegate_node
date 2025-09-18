const prisma = require("../DB/db.config");

//Create User
exports.createDefUser = async (req, res) => {
  const profile_picture = "uploads/profiles/default/profile.jpg";
  try {
    // Validation  START/---------------------------------/
    const {
      user_name,
      user_type,
      email_addresses,
      created_by,
      last_updated_by,
    } = req.body;

    const findDefUserName = await prisma.def_users.findFirst({
      where: {
        user_name: user_name,
      },
    });
    if (findDefUserName)
      return res.status(409).json({ message: "User Name already exist." });
    if (!user_name || !user_type) {
      return res.status(422).json({
        message: "User name, User type is Required",
      });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.def_users.create({
      data: {
        user_name: user_name,
        user_type: user_type,
        email_addresses: email_addresses,
        created_by: created_by,
        last_updated_by: last_updated_by,
        profile_picture: profile_picture,
      },
    });
    if (result) {
      return res.status(201).json(result);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
