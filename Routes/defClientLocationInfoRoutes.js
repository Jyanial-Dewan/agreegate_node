const Router = require("express");
const clientLocationInfo = require("../Controller/defClientLocationInfoController");

const router = Router();

router.post("/", clientLocationInfo.addClientLocationInfo);
router.get("/", clientLocationInfo.getClientLocationInfo);

module.exports = router;
