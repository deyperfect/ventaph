import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "gaming-pc",
        "processor",
        "graphics-card",
        "motherboard",
        "ram",
        "storage",
        "cooler",
        "power-supply",
        "case",
      ],
    },
    title: {
      type: String,
      required: [true, "Listing title is required"],
      maxlength: [100, "Title cannot exceed 100 characters"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be at least 1"],
    },
    description: {
      type: String,
      required: [true, "Listing description is required"],
      minlength: [10, "Listing description is too short"],
      trim: true,
    },
    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: ["new", "used"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    dealMethod: {
      type: String,
      enum: ["shipping", "meetup"],
      required: [true, "Deal Method is required"],
    },
    photos: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          publicId: {
            type: String,
            required: true,
          },
        },
      ],
      required: true,
      validate: [
        {
          validator: (photos) => photos.length >= 1 && photos.length <= 10,
          message: "Listing must have between 1 and 10 photos",
        },
      ],
    },
    status: {
      type: String,
      enum: ["pending", "available", "rejected", "sold", "suspended"],
      default: "pending",
    },
  },
  { timestamps: true },
);

listingSchema.index({ userId: 1 });
listingSchema.index({ category: 1, status: 1 });
listingSchema.index({ createdAt: -1 });

export default mongoose.model("Listing", listingSchema);
