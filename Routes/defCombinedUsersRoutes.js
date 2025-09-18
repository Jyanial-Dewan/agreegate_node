const Router = require("express");
const defCombinedUsersController = require("../Controller/defCombinedUsers");

const router = Router();

router.post("/", defCombinedUsersController.createCombinedUser);

module.exports = router;
