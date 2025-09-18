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

    // if (user_type !== "person") {
    //   // defuser
    //   // await axios.post(`${FLASK_ENDPOINT_URL}/defuser`, );
    //   // //  defcredentials
    //   // await axios.post(
    //   //   `${FLASK_ENDPOINT_URL}/def_user_credentials`,
    //   //
    //   // );
    //   const newUser = await prisma.def_users.create({
    //     data: {
    //       user_name: user_name,
    //       user_type: user_type,
    //       email_addresses: [email_address],
    //       created_by: created_by,
    //       last_updated_by: last_updated_by,
    //     },
    //   });

    //   await prisma.def_user_credentials.create({
    //     data: {
    //       user_id: newUser.user_id,
    //       password: await hashPassword(password),
    //     },
    //   });
    // }

    if (!user_name || !user_type) {
      return res.status(422).json({
        message: "user_name, user_type is Required",
      });
    }
    if (newUser && newPerson && newCredential) {
      return res.status(201).json({
        message: "User Recrod Created",
        user: { ...newUser, ...newPerson },
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
