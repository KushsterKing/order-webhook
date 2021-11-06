// let jwt = require("./_helpers/jwt");
let errorHandler = require("./_helpers/errorHandler");

module.exports = function (app) {

  // app.use("/v1/admin", [jwt()]);

  // app.use("/v1/admin/auth", require("./modules/auth"));
  // app.use("/v1/admin/users", require("./modules/users"));

  app.use("/v1/admin/domains", require("./modules/domains"));
  app.use("/v1/admin/orders", require("./modules/orders"));

  app.use(errorHandler); // this line will be in last
};
