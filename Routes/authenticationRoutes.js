const Router = require("express");
const authentication = require("../Authentication/authentication");

const router = Router();

router.post("/", authentication.login);

module.exports = router;
