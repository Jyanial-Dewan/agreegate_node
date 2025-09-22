const Router = require("express");
const authUserController = require("../Controller/authUserController");

const router = Router();

router.get("/", authUserController.user);

module.exports = router;
