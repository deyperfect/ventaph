import express from 'express';
import protect from '../middleware/protect.js';
import messageController from '../controllers/messageController.js';

const router = express.Router();

// Send new message
router.post('/:conversationId/messages', protect, messageController.sendMessage);

// Get messages for a conversation
router.get('/:conversationId/messages', protect, messageController.getMessages);

export default router;