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

    const recipientId = await findBy(decoded.email, "email", "id");

    const receivedMessages = await Messages.find({ recipient: recipientId });
    const sentMessages = await Messages.find({ sender: recipientId });

    await Messages.updateMany({ recipient: recipientId }, { read: true });

    const sentMessagesCopy = await Promise.all(
      sentMessages.map(async (message) => {
        const recipientEmail = await findBy(message.recipient, "_id", "email");
        return { ...message.toJSON(), recipient: recipientEmail };
      })
    );

    const receivedMessagesCopy = await Promise.all(
      receivedMessages.map(async (message) => {
        const senderEmail = await findBy(message.sender, "_id", "email");
        return { ...message.toJSON(), sender: senderEmail };
      })
    );

    return res.status(200).json({
      success: true,
      sentMessages: sentMessagesCopy,
      receivedMessages: receivedMessagesCopy,
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

module.exports = {
  getMessages,
  addMessage,
  findBy,
};
