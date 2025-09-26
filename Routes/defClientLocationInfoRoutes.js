const Router = require("express");
const clientLocationInfo = require("../Controller/defClientLocationInfoController");

const router = Router();

router.post("/", clientLocationInfo.addClientLocationInfo);

module.exports = router;
