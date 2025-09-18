const Router = require("express");
const defUsersRoutes = require("./defUsersRoutes");

const routes = Router();

routes.use("/users", defUsersRoutes);

module.exports = routes;
