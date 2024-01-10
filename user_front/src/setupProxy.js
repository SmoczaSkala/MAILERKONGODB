const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    [
      "/api/user/login",
      "/users/messages/received",
      "/users/messages/sent",
      "/users/messages/send",
      "/api/users",
      "/api/messages",
    ],
    createProxyMiddleware({
      target: "http://localhost:8080/",
      changeOrigin: true,
    })
  );
};
