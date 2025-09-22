const Router = require("express");
const ipController = require("../Controller/ipController");

const router = Router();

router.get("/", ipController.getIPAdress);

module.exports = router;
