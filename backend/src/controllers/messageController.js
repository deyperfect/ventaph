import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

const sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { conversationId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      $or: [{ buyerId: senderId }, { sellerId: senderId }],
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content is required.",
      });
    }

    if (content.length > 200) {
      return res.status(400).json({
        success: false,
        message: "Message cannot exceed 200 characters.",
      });
    }

    const message = new Message({
      conversationId,
      senderId,
      content,
    });

    await message.save();
    conversation.lastMessage = message.content;
    conversation.lastMessageAt = message.createdAt;

    await conversation.save();

    return res.status(201).json({
      success: true,
      data: message,
    });

  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      $or: [{ buyerId: userId }, { sellerId: userId }],
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 });  

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  sendMessage,
  getMessages,};
