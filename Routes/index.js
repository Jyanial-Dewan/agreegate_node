const Router = require("express");
const defUsersRoutes = require("./defUsersRoutes");
const defCombinedUsersRoutes = require("./defCombinedUsersRoutes");
const authentication = require("./authenticationRoutes");
const authMeRoutes = require("./authMeRoutes")
const verifyUser= require("../Middleware/verifyUser")

const routes = Router();
routes.use("/login", authentication);
routes.use("/users", defUsersRoutes);
routes.use("/combined_users", defCombinedUsersRoutes);
routes.use(verifyUser);

routes.use("/auth/me",authMeRoutes);

module.exports = routes;
