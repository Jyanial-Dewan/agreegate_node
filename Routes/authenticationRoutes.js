const Router = require("express");
const authentication = require("../Authentication/authentication");

const router = Router();

router.post("/login", authentication.login);
router.post("/logout", authentication.logout);
router.get("/refresh_token", authentication.refreshToken);

module.exports = router;
