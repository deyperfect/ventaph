import Conversation from "../models/Conversation.js";
import Listing from "../models/Listing.js";

const createConversation = async (req, res, next) => {
  try {
    const { listingId } = req.params;

    const listing = await Listing.findOne({
      _id: listingId,
      status: "available",
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found.",
      });
    }

    const sellerId = listing.userId;
    const buyerId = req.user._id;

    if (sellerId.toString() === buyerId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot create a conversation with yourself.",
      });
    }

    const existingConversation = await Conversation.findOne({
      buyerId,
      listingId,
    });

    if (existingConversation) {
      return res.status(200).json({
        success: true,
        data: existingConversation,
      });
    }

    const newConversation = new Conversation({
      listingId,
      buyerId,
      sellerId,
    });

    await newConversation.save();

    return res.status(201).json({
      success: true,
      data: newConversation,
    });
  } catch (error) {
    next(error);
  }
};

const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      $or: [{ buyerId: userId }, { sellerId: userId }],
    })
      .populate("listingId", "title price")
      .sort({ lastMessageAt: -1, createdAt: -1 });

    if (conversations.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No conversations found.",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

const getConversationById = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      $or: [{ buyerId: userId }, { sellerId: userId }],
    })
      .populate("listingId", "title price");

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createConversation,
  getConversations,
  getConversationById,
};
