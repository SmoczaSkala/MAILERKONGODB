const express = require("express");
const router = express.Router();
const usersService = require("./service/users");
const messagesRoutes = require("./../messages/message.route");

router.get("/api/users", usersService.getUsers);
router.use("/:userId/messages", messagesRoutes);

module.exports = router;
