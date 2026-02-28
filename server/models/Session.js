const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: { 
    type: String, 
    enum: ['user', 'assistant'], 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const SessionSchema = new mongoose.Schema({
  sessionId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  budget: { 
    type: Number, 
    required: true 
  },
  spent: { 
    type: Number, 
    default: 0 
  },
  city: { 
    type: String 
  },
  eventType: { 
    type: String, 
    enum: ['travel', 'event'] 
  },
  messages: [MessageSchema],
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 86400    // auto delete after 24 hours
  }
});

module.exports = mongoose.model('Session', SessionSchema);