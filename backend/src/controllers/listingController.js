import Listing from "../models/Listing.js";
import { v2 as cloudinary } from "cloudinary";

const createListing = async (req, res, next) => {
  try {
    const {
      title,
      category,
      price,
      description,
      condition,
      location,
      dealMethod,
    } = req.body;

    if (
      !title ||
      !category ||
      !price ||
      !description ||
      !condition ||
      !location ||
      !dealMethod
    ) {
      return res.status(400).json({
        success: false,
        message: "Please populate all fields.",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload atleast 1 photo.",
      });
    }

    // Extracted URLs
    const photos = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    const newListing = await Listing.create({
      userId: req.user._id,
      title: title.trim(),
      category,
      price: Number(price),
      description: description.trim(),
      condition,
      location: location.trim(),
      dealMethod,
      photos,
    });

    return res.status(201).json({
      success: true,
      data: newListing,
    });
  } catch (error) {
    next(error);
  }
};

const getListings = async (req, res, next) => {
  try {
    // pagination query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const listings = await Listing.find({ status: "available" })
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    const totalListings = await Listing.countDocuments({ status: "available" });

    return res.status(200).json({
      success: true,
      results: listings.length,
      totalListings,
      currentPage: page,
      totalPages: Math.ceil(totalListings / limit),
      data: listings,
    });
  } catch (error) {
    next(error);
  }
};

const getListingById = async (req, res, next) => {
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

    return res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

const updateListing = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const {
      title,
      category,
      price,
      description,
      condition,
      location,
      dealMethod,
    } = req.body;

    if (
      title === undefined &&
      category === undefined &&
      price === undefined &&
      description === undefined &&
      condition === undefined &&
      location === undefined &&
      dealMethod === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Nothing to update. Please provide at least one field to update.",
      });
    }

    // Only update fields that are provided
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (category !== undefined) updates.category = category.trim();
    if (price !== undefined) updates.price = Number(price);
    if (description !== undefined) updates.description = description.trim();
    if (condition !== undefined) updates.condition = condition.trim();
    if (location !== undefined) updates.location = location.trim();
    if (dealMethod !== undefined) updates.dealMethod = dealMethod.trim();

    // Owner-only update;
    const updatedListing = await Listing.findOneAndUpdate(
      { _id: listingId, userId: req.user._id },
      updates,
      { new: true, runValidators: true },
    );

    if (!updatedListing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found or you are not allowed to update it",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedListing,
    });
  } catch (error) {
    next(error);
  }
};

const deleteListing = async (req, res, next) => {
  try {
    const { listingId } = req.params;

    const listing = await Listing.findOne({
      _id: listingId,
      userId: req.user._id,
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found.",
      });
    }

    for (const photo of listing.photos) {
      const result = await cloudinary.uploader.destroy(photo.publicId);

      if (result.result !== "ok" && result.result !== "not found") {
        throw new Error(`Failed to delete Cloudinary asset: ${photo.publicId}`);
      }
    }

    const deletedListing = await Listing.findOneAndDelete({
      _id: listingId,
      userId: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getMyListings = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const listings = await Listing.find({ userId }).sort({ createdAt: -1 });

    if (listings.length === 0) {
      return res.status(200).json({
        success: true,
        results: 0,
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      results: listings.length,
      data: listings,
    });
  } catch (error) {
    next(error);
  }
};

const updateListingStatus = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    
    const listing = await Listing.findOne({
      _id: listingId,
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found.",
      });
    }

    const isOwner = listing.userId.toString() === req.user._id.toString();

    if (req.path.endsWith("/sold")) {
      if (!isOwner) {
        return res.status(403).json({
        success: false,
        message: "You are not allowed to mark this listing as sold.",
      });
      }
      
      if (listing.status !== "available") {
        return res.status(400).json({
        success: false,
        message: "Only available listings can be marked as sold.",
      });
      }

      listing.status = "sold";
      await listing.save();

      return res.status(200).json({
        success: true,
        message: "Listing marked as sold.",
      });

    }

    if (req.path.endsWith("/available")) {
      if (!isOwner) {
        return res.status(403).json({
        success: false,
        message: "You are not allowed to mark this listing as available.",
      });
      }
      
      if (listing.status !== "sold") {
        return res.status(400).json({
        success: false,
        message: "Only sold listings can be marked as available.",
      });
      }

      listing.status = "available";
      await listing.save();

      return res.status(200).json({
        success: true,
        message: "Listing marked as available.",
      });

    }

    const isAdmin = req.user.role === "admin";
    const availableStatuses = ["available", "rejected", "suspended"];
    const { status } = req.body;

    if (req.path.endsWith("/status")) {
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to update this listing.",
        });
      }

      const updatedStatus = {};
      if (
        status !== undefined &&
        status !== "sold" &&
        availableStatuses.includes(status)
      ) {
        updatedStatus.status = status;
      } else if (status === undefined) {
        return res.status(400).json({
          success: false,
          message: "Status is required.",
        });
      } else if (!availableStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Allowed values: ${availableStatuses.join(", ")}`,
        });
      }

      const updatedListing = await Listing.findOneAndUpdate(
        { _id: listingId },
        updatedStatus,
        { new: true, runValidators: true },
      );

      return res.status(200).json({
        success: true,
        data: updatedListing,
      });
    }
  } catch (error) {
    next(error);
  }
};

// const updateListingStatus = async (req, res, next) => {
//   try {
//     const { listingId } = req.params;
//     const { status } = req.body;

//     const listing = await Listing.findOne({
//       _id: listingId,
//     });

//     if (!listing) {
//       return res.status(404).json({
//         success: false,
//         message: "Listing not found.",
//       });
//     }

//     const isOwner = listing.userId.toString() === req.user._id.toString();
//     const isAdmin = req.user.role === "admin";

//     if (req.path.endsWith("/sold")) {
//       if (!isOwner) {
//         return res.status(403).json({
//           success: false,
//           message: "You are not allowed to mark this listing as sold.",
//         });
//       }

//       listing.status = "sold";
//       await listing.save();

//       return res.status(200).json({
//         success: true,
//         message: "Listing marked as sold.",
//         data: listing,
//       });
//     }

//     if (req.path.endsWith("/status")) {
//       if (!isAdmin) {
//         return res.status(403).json({
//           success: false,
//           message: "You are not allowed to update this listing.",
//         });
//       }

//       // Input Validation
//       if (!status) {
//         return res.status(400).json({
//           success: false,
//           message: "Status is required.",
//         });
//       }

//       const availableStatuses = ["available", "rejected", "suspended"];

//       if (!availableStatuses.includes(status)) {
//         return res.status(400).json({
//           success: false,
//           message: `Invalid status. Allowed values: ${availableStatuses.join(", ")}`,
//         });
//       }

//       listing.status = status;
//       await listing.save();

//       return res.status(200).json({
//         success: true,
//         message: "Listing status updated successfully.",
//         data: listing,
//       });
//     }

//   } catch (error) {
//     next(error);
//   }
// };

export default {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  getMyListings,
  updateListingStatus,
};
