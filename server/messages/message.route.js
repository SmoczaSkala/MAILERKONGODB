const express = require("express");
const router = express.Router();
const messagesService = require("./service/messages");

router.get("/api/messages", messagesService.getMessages);
router.post("/api/messages", messagesService.addMessage);

module.exports = router;
