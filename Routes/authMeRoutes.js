const Router = require("express");
const authMeController = require("../Controller/authMeController");

const router = Router();

router.get("/", authMeController.user);

module.exports = router;