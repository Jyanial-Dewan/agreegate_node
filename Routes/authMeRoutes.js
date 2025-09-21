const Router = require("express");
const authMeController = require("../Controller/authMeController");

const router = Router();

router.post("/", authMeController.user);

module.exports = router;