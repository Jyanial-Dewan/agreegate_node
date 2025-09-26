const Router = require("express");
const clientInfo = require("../Controller/defClientInfoController");

const router = Router();

router.post("/", clientInfo.addClientInfo);

module.exports = router;
