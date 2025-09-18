const Router = require("express");
const defUsersRoutes = require("./defUsersRoutes");
const defCombinedUsersRoutes = require("./defCombinedUsersRoutes");
const authentication = require("./authenticationRoutes");

const routes = Router();

routes.use("/login", authentication);
routes.use("/users", defUsersRoutes);
routes.use("/combined_users", defCombinedUsersRoutes);

module.exports = routes;
