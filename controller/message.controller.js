import Message from "../model/message.model.js";
import { io } from "../index.js";

// Send message
export const sendMessage = async (req, res) => {
  try {
    const from = req.user.id;
    const to = req.params.id;
    const { message } = req.body;
    if (!message) return res.status(400).json({ msg: "Message required" });

    const newMessage = await Message.create({ from, to, message });
    io.emit("receive_message", newMessage);
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get messages
export const getMessage = async (req, res) => {
  try {
    const from = req.user.id;
    const to = req.params.id;
    const messages = await Message.find({
      $or: [
        { from, to },
        { from: to, to: from }
      ]
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
