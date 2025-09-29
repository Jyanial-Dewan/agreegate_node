const prisma = require("../DB/db.config");
const crypto = require("crypto");

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(8).toString("hex");
    const iterations = 600000;
    const keyLength = 32;
    const digest = "sha256";

    crypto.pbkdf2(
      password,
      salt,
      iterations,
      keyLength,
      digest,
      (err, derivedKey) => {
        if (err) return reject(err);

        const formattedHash = `pbkdf2:${digest}:${iterations}$${salt}$${derivedKey.toString(
          "hex"
        )}`;
        resolve(formattedHash);
      }
    );
  });
};

exports.getCombinedUser = async (req, res) => {
  const { user_id, page = 1, limit = 8 } = req.query;

  try {
    if (!user_id) {
      const users = await prisma.def_users_v.findMany({
        orderBy: {
          created_on: "desc",
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      const total = await prisma.def_users_v.count();

      return res.status(200).json({
        result: users,
        totalData: total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      });
    }
    const existUser = await prisma.def_users_v.findFirst({
      where: {
        user_id: Number(user_id),
      },
    });

    if (!existUser) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json({ result: existUser });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createCombinedUser = async (req, res) => {
  try {
    const {
      user_type,
      user_name,
      email_address,
      first_name,
      last_name,
      password,
    } = req.body;

    const profile_picture = {
      original: "uploads/profiles/default/profile.jpg",
      thumbnail: "uploads/profiles/default/thumbnail.jpg",
    };

    const existUser = await prisma.def_users.findFirst({
      where: {
        user_name,
      },
    });

    if (existUser) {
      return res.status(409).json({
        message: "Username is already exist.",
      });
    }

    const newUser = await prisma.def_users.create({
      data: {
        user_name: user_name,
        user_type: user_type,
        email_addresses: [email_address],
        profile_picture: profile_picture,
      },
    });

    const newPerson = await prisma.def_persons.create({
      data: {
        user_id: newUser.user_id,
        first_name: first_name,
        last_name: last_name,
      },
    });

    const newCredential = await prisma.def_user_credentials.create({
      data: {
        user_id: newUser.user_id,
        password: await hashPassword(password),
      },
    });

    if (!user_name || !user_type) {
      return res.status(422).json({
        message: "User Name and User Type fields are Required",
      });
    }
    if (newUser && newPerson && newCredential) {
      return res.status(201).json({
        message: "User Registered",
        result: { ...newUser, ...newPerson },
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateCombinedUser = async (req, res) => {
  try {
    const { user_type, user_name, email_address, first_name, last_name } =
      req.body;
    const { user_id } = req.params;

    const profile_picture = {
      original: "uploads/profiles/default/profile.jpg",
      thumbnail: "uploads/profiles/default/thumbnail.jpg",
    };

    const existEmail = await prisma.def_users.findFirst({
      where: {
        email_addresses: {
          array_contains: email_address,
        },
        NOT: {
          user_id: Number(user_id),
        },
      },
    });

    if (existEmail) {
      return res.status(409).json({
        message: "Email is already exist.",
      });
    }

    const existUser = await prisma.def_users.findFirst({
      where: {
        user_name,
        NOT: {
          user_id: Number(user_id),
        },
      },
    });

    if (existUser) {
      return res.status(409).json({
        message: "Username is already exist.",
      });
    }

    const uniqueUser = await prisma.def_users.findUnique({
      where: {
        user_id: Number(user_id),
      },
    });
    const uniquePerson = await prisma.def_persons.findUnique({
      where: {
        user_id: Number(user_id),
      },
    });
    const uniqueCredential = await prisma.def_user_credentials.findUnique({
      where: {
        user_id: Number(user_id),
      },
    });

    if (!uniquePerson || !uniqueUser || !uniqueCredential) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.def_users.update({
      where: {
        user_id: Number(user_id),
      },
      data: {
        user_name: user_name,
        user_type: user_type,
        email_addresses: [email_address],
        profile_picture: profile_picture,
      },
    });

    const updatedPerson = await prisma.def_persons.update({
      where: {
        user_id: Number(user_id),
      },
      data: {
        first_name: first_name,
        last_name: last_name,
      },
    });

    return res.status(200).json({
      message: "User Updated",
      result: { ...updatedUser, ...updatedPerson },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateProfileImage = async (req, res) => {
  const { user_id } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const filePath = req.file.path.replace(/\\/g, "/");
    const thumbnailPath = req.file.thumbnailPath
      ? req.file.thumbnailPath.replace(/\\/g, "/")
      : null;

    // Validate user ID
    const findDefUserId = await prisma.def_users.findUnique({
      where: { user_id: Number(user_id) },
    });

    if (!findDefUserId) {
      return res.status(404).json({ message: "User ID not found." });
    }

    // Update user with profile picture and thumbnail
    await prisma.def_users.update({
      where: { user_id: Number(user_id) },
      data: {
        profile_picture: {
          original: filePath || findDefUserId.profile_picture,
          thumbnail: thumbnailPath || findDefUserId.profile_thumbnail,
        },
      },
    });

    return res
      .status(200)
      .json({ message: "Profile image updated successfully." });
  } catch (error) {
    console.error("Error updating profile image:", error);
    return res.status(500).json({ error: error.message });
  }
};
