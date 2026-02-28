const Session = require('../models/Session');
const { chat, extractCostFromMessage } = require('../services/aiService');
const { v4: uuidv4 } = require('uuid');


exports.startSession = async (req, res) => {
  try {
    const { budget, city, eventType } = req.body;

    if (!budget || budget <= 0) {
      return res.status(400).json({
        error: 'Please enter a valid budget amount'
      });
    }

    const sessionId = uuidv4();

    const welcomeMessage = {
      role: 'assistant',
      content: `# Welcome to Smart Spend! 🎯

I am your budget-strict planning assistant.

**Your Budget:** ₹${budget.toLocaleString('en-IN')}
**City:** ${city || 'Not specified yet'}
**Plan Type:** ${eventType === 'travel' ? '✈️ Weekend Travel' : '🎉 Campus Event'}

I will **never** suggest anything that exceeds your ₹${budget.toLocaleString('en-IN')} budget. Every suggestion will have a price tag.

What would you like to plan first?
- 🏨 Accommodation (Hotel/Hostel)
- 🍛 Food (Restaurants/Street Food)
- 🚌 Transport (Bus/Auto/Train)
- 🎭 Activities (Sightseeing/Entertainment)

💰 **Remaining Budget: ₹${budget.toLocaleString('en-IN')}**`
    };

    const session = new Session({
      sessionId,
      budget,
      spent: 0,
      city,
      eventType,
      messages: [welcomeMessage]
    });

    await session.save();

    res.json({
      sessionId,
      budget,
      spent: 0,
      messages: session.messages
    });

  } catch (err) {
    console.error('Error starting session:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.sendMessage = async (req, res) => {
  try {
    const { sessionId, message, confirmSpend } = req.body;

    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (confirmSpend && confirmSpend > 0) {
      session.spent = Math.min(
        session.spent + confirmSpend,
        session.budget
      );
    }

    session.messages.push({
      role: 'user',
      content: message
    });

    const aiResponse = await chat(
      session.messages,
      session.budget,
      session.spent,
      session.city,
      session.eventType
    );

    session.messages.push({
      role: 'assistant',
      content: aiResponse
    });

    await session.save();

    res.json({
      message: aiResponse,
      budget: session.budget,
      spent: session.spent,
      remaining: session.budget - session.spent,
      messages: session.messages
    });

  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.getSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      sessionId: req.params.sessionId
    });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};