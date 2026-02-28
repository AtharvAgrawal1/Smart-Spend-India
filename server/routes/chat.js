const express = require('express');
const router = express.Router();
const { 
  startSession, 
  sendMessage, 
  getSession 
} = require('../controllers/chatController');

// Route: POST /api/chat/session/start
router.post('/session/start', startSession);

// Route: POST /api/chat/message
router.post('/message', sendMessage);

// Route: GET /api/chat/session/:sessionId
router.get('/session/:sessionId', getSession);

module.exports = router;