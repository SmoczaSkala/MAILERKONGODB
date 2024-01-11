const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  //
  _id: mongoose.Schema.Types.ObjectId,
  //
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "No title",
  },
  content: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
