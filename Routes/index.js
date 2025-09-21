const Router = require("express");
const defUsersRoutes = require("./defUsersRoutes");
const defCombinedUsersRoutes = require("./defCombinedUsersRoutes");
const authentication = require("./authenticationRoutes");
const authMeRoutes = require("./authMeRoutes");
const verifyUser = require("../Middleware/verifyUser");

const routes = Router();
routes.use("/api/auth", authentication);
routes.use("/api/users", defUsersRoutes);
routes.use("/api/combined_users", defCombinedUsersRoutes);
routes.use(verifyUser);

routes.use("/api/auth/verify_user", authMeRoutes);

module.exports = routes;
