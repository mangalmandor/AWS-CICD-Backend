const express = require('express');
const { sendMessage, getMessages, getConversations } = require('../controllers/chatController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.post('/send', requireAuth, sendMessage);
router.get('/conversations', requireAuth, getConversations);
router.get('/:otherUserId/:productId', requireAuth, getMessages);

module.exports = router;