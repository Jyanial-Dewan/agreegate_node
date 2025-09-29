const Router = require("express");
const defCombinedUsersController = require("../Controller/defCombinedUsers");
const { upload, generateThumbnail } = require("../Middleware/multerUpload");

const router = Router();

router.post("/register", defCombinedUsersController.createCombinedUser);
router.get("/", defCombinedUsersController.getCombinedUser);
router.put("/:user_id", defCombinedUsersController.updateCombinedUser);
router.put(
  "/update_profile_image/:user_id",
  // (req, res, next) => {

  //   next();
  // },
  upload.single("profileImage"), // The actual file upload middleware
  // (err, req, res, next) => {
  //   if (err) {
  //     console.error("Multer error:", err); // Catch any multer errors
  //     return res.status(400).send(err.message); // Send error response
  //   }
  //   next(); // Proceed to the next middleware
  // },
  // (req, res, next) => {

  //   next(); // Proceed to the next middleware
  // },
  generateThumbnail,
  defCombinedUsersController.updateProfileImage
);

module.exports = router;
