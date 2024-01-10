const Messages = require("./../../models/messages");
const Users = require("./../../models/users");
const jwt = require("jsonwebtoken");

const getMessages = async (req, res) => {
  try {
    const token = req.query.token;
    const decoded = jwt.verify(token, "mailer123");

    if (!decoded.email) {
      return res.status(200).json({ success: false });
    }
    console.log(decoded);

    const receivedMessages = await Messages.find({ receiver: decoded.email });
    const sentMessages = await Messages.find({ sender: decoded.email });

    return res.status(200).json({
      success: true,
      sentMessages,
      receivedMessages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }
};

const findBy = async (search, by, what) => {
  const user = await Users.findOne({ [by]: search });

  if (!user) {
    throw new Error(`User not found by ${by}: ${search}`);
  }

  return user[what];
};

const addMessage = async (req, res) => {
  try {
    const token = req.query.token;
    const decoded = jwt.verify(token, "mailer123");

    if (!decoded.email) {
      return res.status(200).json({ success: false });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;

    const message = await Messages.findById(messageId);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    await Messages.findByIdAndDelete(messageId);

    return res
      .status(200)
      .json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getMessages,
  addMessage,
  deleteMessage,
  findBy,
};
