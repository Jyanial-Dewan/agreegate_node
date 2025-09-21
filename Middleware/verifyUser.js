const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  try {
    const access_token =
      req?.cookies?.access_token ||
      req?.body?.access_token ||
      req.header("Authorization")?.replace("Bearer ", "");
    const refresh_token =
      req?.cookies?.refresh_token ||
      req?.body?.refresh_token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!access_token)
      return res
        .status(401)
        .json({ message: "Unauthorized Access: No token provided" });

    jwt.verify(
      access_token,
      process.env.JWT_SECRET_ACCESS_TOKEN,
      (err, user) => {
        if (err) {
          //if token expired
          if (err.name === "TokenExpiredError") {
            return res
              .status(401)
              .json({ message: "Unauthorized Access: Token has expired" });
          }
          //if token is invalid
          return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
        // Attach the decoded user object and token to the request
        req.user = user;
        req.user.access_token = access_token; // Attach the access_token to req.user
        req.user.refresh_token = refresh_token; // Attach the access_token to req.user

        next();
      }
    );
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

module.exports = verifyUser;
