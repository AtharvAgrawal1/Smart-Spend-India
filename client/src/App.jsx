import { useState } from 'react';
import axios from 'axios';
import ChatWindow from './components/ChatWindow';
import BudgetTracker from './components/BudgetTracker';

const API = '/api/chat';

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad',
  'Chennai', 'Kolkata', 'Jaipur', 'Goa',
  'Manali', 'Rishikesh', 'Agra', 'Varanasi'
];

const BUDGET_PRESETS = [500, 1000, 2000, 5000, 10000];

export default function App() {
  const [screen, setScreen]         = useState('setup');
  const [form, setForm]             = useState({ budget: '', city: '', eventType: 'travel' });
  const [session, setSession]       = useState(null);
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [budgetInfo, setBudgetInfo] = useState({ budget: 0, spent: 0 });
  const [error, setError]           = useState('');

  // ---------- START SESSION ----------
  const startSession = async () => {
    if (!form.budget || form.budget <= 0) {
      setError('Please enter a valid budget amount');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post(`${API}/session/start`, {
        budget: parseFloat(form.budget),
        city: form.city,
        eventType: form.eventType
      });

      setSession(data.sessionId);
      setMessages(data.messages);
      setBudgetInfo({ budget: data.budget, spent: data.spent });
      setScreen('chat');

    } catch (err) {
      setError('Cannot connect to server');
    }

    setLoading(false);
  };

  // ---------- SEND MESSAGE ----------
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post(`${API}/message`, {
        sessionId: session,
        message: userMsg
      });

      setMessages(data.messages);
      setBudgetInfo({ budget: data.budget, spent: data.spent });

    } catch (err) {
      setError('Try again');
    }

    setLoading(false);
  };

  // ---------- RESET ----------
  const resetApp = () => {
    setScreen('setup');
    setSession(null);
    setMessages([]);
    setBudgetInfo({ budget: 0, spent: 0 });
    setForm({ budget: '', city: '', eventType: 'travel' });
    setError('');
  };

  // ============================
  // SETUP SCREEN
  // ============================
  if (screen === 'setup') {
    return (
      <div style={styles.page}>
        <div style={styles.card}>

          {/* Header */}
          <div style={styles.header}>
            <div style={styles.emoji}>💸</div>
            <h1 style={styles.appTitle}>Smart Spend</h1>
            <p style={styles.subtitle}>Budget-strict Travel & Event Planner</p>
            <p style={styles.hindi}>₹ mein socho, sahi jagah ghoomo!</p>
          </div>

          {/* Plan Type Toggle */}
          <label style={styles.label}>Kya plan karna hai?</label>
          <div style={styles.toggleRow}>
            <button
              style={{
                ...styles.toggleBtn,
                background: form.eventType === 'travel' ? '#6366f1' : '#2a2a3e',
                borderColor: form.eventType === 'travel' ? '#6366f1' : '#444'
              }}
              onClick={() => setForm({ ...form, eventType: 'travel' })}
            >
              ✈️ Weekend Travel
            </button>
            <button
              style={{
                ...styles.toggleBtn,
                background: form.eventType === 'event' ? '#6366f1' : '#2a2a3e',
                borderColor: form.eventType === 'event' ? '#6366f1' : '#444'
              }}
              onClick={() => setForm({ ...form, eventType: 'event' })}
            >
              🎉 Campus Event
            </button>
          </div>

          {/* Budget Input */}
          <label style={styles.label}>Aapka Budget (₹)</label>
          <div style={styles.budgetRow}>
            <span style={styles.rupee}>₹</span>
            <input
              style={styles.budgetInput}
              type="number"
              placeholder="e.g. 2000"
              value={form.budget}
              onChange={e => setForm({ ...form, budget: e.target.value })}
            />
          </div>

          {/* Budget Quick Buttons */}
          <div style={styles.presetRow}>
            {BUDGET_PRESETS.map(amt => (
              <button
                key={amt}
                style={{
                  ...styles.presetBtn,
                  background: form.budget == amt ? '#6366f1' : '#2a2a3e',
                  borderColor: form.budget == amt ? '#6366f1' : '#444'
                }}
                onClick={() => setForm({ ...form, budget: amt })}
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          {/* City Input */}
          <label style={styles.label}> City</label>
          <input
            style={styles.textInput}
            placeholder="e.g. Jaipur, Goa, Mumbai..."
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}
          />

          {/* City Quick Buttons */}
          <div style={styles.cityGrid}>
            {CITIES.map(city => (
              <button
                key={city}
                style={{
                  ...styles.cityBtn,
                  background: form.city === city ? '#6366f1' : '#2a2a3e',
                  borderColor: form.city === city ? '#6366f1' : '#333'
                }}
                onClick={() => setForm({ ...form, city })}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && <p style={styles.error}>❌ {error}</p>}

          {/* Start Button */}
          <button
            style={{ ...styles.startBtn, opacity: loading ? 0.7 : 1 }}
            onClick={startSession}
            disabled={loading}
          >
            {loading ? '⏳ Starting...' : '🚀 Start new plan'}
          </button>

        </div>
      </div>
    );
  }

  // ============================
  // CHAT SCREEN
  // ============================
  return (
    <div style={styles.chatPage}>

      {/* LEFT SIDEBAR */}
      <div style={styles.sidebar}>

        <div>
          <h2 style={styles.sidebarTitle}>💸 Smart Spend</h2>
          <p style={styles.sidebarInfo}>📍 {form.city || 'India'}</p>
          <p style={styles.sidebarInfo}>
            {form.eventType === 'travel' ? '✈️ Weekend Travel' : '🎉 Campus Event'}
          </p>
        </div>

        {/* Budget Tracker Component */}
        <BudgetTracker
          budget={budgetInfo.budget}
          spent={budgetInfo.spent}
        />

        {/* Quick Message Buttons */}
        <div>
          <p style={styles.quickLabel}>Quick Questions:</p>
            {[
  '🍛 Find me cheap food options',
  '🏨 I need a budget hotel',
  '🚌 What are the cheapest transport options?',
  '🎭 What free activities are available?',
  '💰 What fits in my remaining budget?'

          ].map(prompt => (
            <button
              key={prompt}
              style={styles.quickBtn}
              onClick={() => setInput(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* New Plan Button */}
        <button style={styles.newPlanBtn} onClick={resetApp}>
          🔄 Start New Plan
        </button>

      </div>

      {/* RIGHT CHAT AREA */}
      <div style={styles.chatArea}>

        {/* Top Bar */}
        <div style={styles.topBar}>
          <span style={styles.topTitle}>🤖 Smart Spend Assistant</span>
          <span style={styles.topBudget}>
            Budget: ₹{budgetInfo.budget.toLocaleString('en-IN')} | 
            Bacha: ₹{(budgetInfo.budget - budgetInfo.spent).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Chat Messages */}
        <ChatWindow messages={messages} loading={loading} />

        {/* Error */}
        {error && (
          <div style={styles.errorBar}>❌ {error}</div>
        )}

        {/* Message Input */}
        <div style={styles.inputArea}>
          <input
            style={styles.chatInput}
            placeholder="Ask anything... (e.g. 'Find me a cheap hotel')')"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button
            style={{
              ...styles.sendBtn,
              opacity: (loading || !input.trim()) ? 0.5 : 1
            }}
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            ➤
          </button>
        </div>

      </div>
    </div>
  );
}

// ============================
// ALL STYLES
// ============================
const styles = {

  // Setup Screen
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f0f1a',
    padding: '20px'
  },
  card: {
    background: '#1e1e2e',
    padding: '36px',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '8px'
  },
  emoji: {
    fontSize: '52px',
    marginBottom: '8px'
  },
  appTitle: {
    color: '#6366f1',
    margin: '0',
    fontSize: '34px',
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#888888',
    margin: '4px 0 0',
    fontSize: '14px'
  },
  hindi: {
    color: '#555555',
    margin: '4px 0 0',
    fontSize: '13px'
  },
  label: {
    color: '#aaaaaa',
    fontSize: '13px',
    marginBottom: '-6px'
  },
  toggleRow: {
    display: 'flex',
    gap: '10px'
  },
  toggleBtn: {
    flex: 1,
    padding: '12px',
    border: '2px solid',
    borderRadius: '10px',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  budgetRow: {
    display: 'flex',
    alignItems: 'center',
    background: '#2a2a3e',
    borderRadius: '10px',
    border: '1px solid #444444',
    overflow: 'hidden'
  },
  rupee: {
    padding: '12px 16px',
    color: '#6366f1',
    fontSize: '20px',
    fontWeight: 'bold',
    background: '#333333'
  },
  budgetInput: {
    flex: 1,
    padding: '12px',
    background: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontSize: '20px',
    outline: 'none'
  },
  presetRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  presetBtn: {
    padding: '6px 14px',
    border: '1px solid',
    borderRadius: '999px',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '13px'
  },
  textInput: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #444444',
    background: '#2a2a3e',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none'
  },
  cityGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  cityBtn: {
    padding: '5px 14px',
    border: '1px solid',
    borderRadius: '999px',
    color: '#cccccc',
    cursor: 'pointer',
    fontSize: '12px'
  },
  error: {
    color: '#ef4444',
    fontSize: '13px',
    margin: '0'
  },
  startBtn: {
    padding: '15px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '17px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px'
  },

  // Chat Screen
  chatPage: {
    display: 'flex',
    height: '100vh',
    background: '#0f0f1a',
    overflow: 'hidden'
  },
  sidebar: {
    width: '270px',
    padding: '20px',
    borderRight: '1px solid #222222',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    overflowY: 'auto'
  },
  sidebarTitle: {
    color: '#6366f1',
    margin: '0 0 6px',
    fontSize: '20px'
  },
  sidebarInfo: {
    color: '#888888',
    margin: '0',
    fontSize: '13px'
  },
  quickLabel: {
    color: '#666666',
    fontSize: '12px',
    margin: '0 0 6px'
  },
  quickBtn: {
    width: '100%',
    padding: '8px 10px',
    background: '#2a2a3e',
    border: '1px solid #333333',
    borderRadius: '8px',
    color: '#cccccc',
    cursor: 'pointer',
    fontSize: '12px',
    textAlign: 'left',
    marginBottom: '5px'
  },
  newPlanBtn: {
    marginTop: 'auto',
    padding: '10px',
    background: '#2a2a3e',
    border: '1px solid #444444',
    borderRadius: '10px',
    color: '#888888',
    cursor: 'pointer',
    fontSize: '13px'
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  topBar: {
    padding: '14px 20px',
    borderBottom: '1px solid #222222',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#1a1a2e'
  },
  topTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '15px'
  },
  topBudget: {
    color: '#6366f1',
    fontSize: '13px'
  },
  errorBar: {
    background: '#2d1515',
    color: '#ef4444',
    padding: '8px 20px',
    fontSize: '13px'
  },
  inputArea: {
    display: 'flex',
    gap: '10px',
    padding: '16px 20px',
    borderTop: '1px solid #222222',
    background: '#1a1a2e'
  },
  chatInput: {
    flex: 1,
    padding: '13px 18px',
    borderRadius: '999px',
    border: '1px solid #333333',
    background: '#2a2a3e',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none'
  },
  sendBtn: {
    padding: '13px 20px',
    background: '#6366f1',
    color: '#ffffff',
    border: 'none',
    borderRadius: '999px',
    cursor: 'pointer',
    fontSize: '18px'
  }
};