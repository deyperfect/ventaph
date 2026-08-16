import express from 'express';
import protect from '../middleware/protect.js';
import authorize from '../middleware/authorize.js';
import upload from '../config/cloudinary.js';
import listingController from '../controllers/listingController.js';

const router = express.Router();

// Create listing
router.post(
  '/create',
  protect,
  upload.array('photos', 10),
  listingController.createListing
);

// Get all listings
router.get('/', listingController.getListings);

// Get listings for the authenticated user
router.get('/my-listings/', protect, listingController.getMyListings);

// Get a single listing by ID
router.get('/:listingId', listingController.getListingById);

// Update a listing by ID
router.patch(
  '/:listingId',
  protect,
//   upload.array('photos', 10),
  listingController.updateListing
);

// Delete a listing by ID
router.delete('/:listingId', protect, listingController.deleteListing);

// Update listing status by ID
router.patch('/:listingId/sold', protect, listingController.updateListingStatus);
router.patch('/:listingId/available', protect, listingController.updateListingStatus);
router.patch('/:listingId/status', protect, authorize("admin"), listingController.updateListingStatus);


export default router;