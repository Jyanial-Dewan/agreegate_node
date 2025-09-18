const Router = require("express");
const defUsersController = require("../Controller/defUsersController");

const router = Router();

router.post("/", defUsersController.createDefUser);

module.exports = router;
