import express from 'express';
import protect from '../middleware/protect.js';
import conversationController from '../controllers/conversationController.js';

const router = express.Router();

// Create new conversation
router.post('/:listingId', protect, conversationController.createConversation);

// Get all conversations 
router.get('/', protect, conversationController.getConversations);

// Get a specific conversation by ID
router.get('/:conversationId', protect, conversationController.getConversationById);

export default router;