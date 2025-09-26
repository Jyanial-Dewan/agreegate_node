const Router = require("express");
const defUsersRoutes = require("./defUsersRoutes");
const defCombinedUsersRoutes = require("./defCombinedUsersRoutes");
const authentication = require("./authenticationRoutes");
const authUserRoutes = require("./authUserRoutes");
const ipRoutes = require("./ipRoutes");
const defClientInfoRoutes = require("./defClientInfoRoutes");
const defClientLocationInfoRoutes = require("./defClientLocationInfoRoutes");
const verifyUser = require("../Middleware/verifyUser");

const routes = Router();
routes.use("/api/auth", authentication);
routes.use("/api/users", defUsersRoutes);
routes.use("/api/combined_users", defCombinedUsersRoutes);
routes.use("/api/geo", ipRoutes);
routes.use("/api/client_info", defClientInfoRoutes);
routes.use("/api/client_location_info", defClientLocationInfoRoutes);
routes.use(verifyUser);

routes.use("/api/auth/verify_user", authUserRoutes);

module.exports = routes;
