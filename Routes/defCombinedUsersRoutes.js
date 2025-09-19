const Router = require("express");
const defCombinedUsersController = require("../Controller/defCombinedUsers");

const router = Router();

router.post("/register", defCombinedUsersController.createCombinedUser);
router.get("/:userId", defCombinedUsersController.getSingleCombinedUser);
router.put("/:userId", defCombinedUsersController.updateCombinedUser);

module.exports = router;
