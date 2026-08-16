import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessage: {
      type: String,
      trim: true,
      default: null,
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

conversationSchema.index(
  { buyerId: 1, listingId: 1 },
  { unique: true }
);

// conversationSchema.index({ listingId: 1, buyerId: 1 }, { unique: true });
// conversationSchema.index({ buyerId: 1 });
// conversationSchema.index({ sellerId: 1 });

export default mongoose.model("Conversation", conversationSchema);
