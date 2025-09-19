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

exports.getSingleCombinedUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const uniqueUser = await prisma.def_users.findUnique({
      where: {
        user_id: Number(userId),
      },
    });
    const uniquePerson = await prisma.def_persons.findUnique({
      where: {
        user_id: Number(userId),
      },
    });

    if (!uniquePerson || !uniqueUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ result: { ...uniqueUser, ...uniquePerson } });
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
        message: "user_name, user_type is Required",
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
    const {
      user_type,
      user_name,
      email_address,
      first_name,
      last_name,
      password,
    } = req.body;
    const { userId } = req.params;

    const profile_picture = {
      original: "uploads/profiles/default/profile.jpg",
      thumbnail: "uploads/profiles/default/thumbnail.jpg",
    };

    const uniqueUser = await prisma.def_users.findUnique({
      where: {
        user_id: Number(userId),
      },
    });
    const uniquePerson = await prisma.def_persons.findUnique({
      where: {
        user_id: Number(userId),
      },
    });
    const uniqueCredential = await prisma.def_user_credentials.findUnique({
      where: {
        user_id: Number(userId),
      },
    });

    if (!uniquePerson || !uniqueUser || !uniqueCredential) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.def_users.update({
      where: {
        user_id: Number(userId),
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
        user_id: Number(userId),
      },
      data: {
        first_name: first_name,
        last_name: last_name,
      },
    });

    await prisma.def_user_credentials.update({
      where: {
        user_id: Number(userId),
      },
      data: {
        password: await hashPassword(password),
      },
    });

    return res.status(200).json({
      message: "User Updated",
      user: { ...updatedUser, ...updatedPerson },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
