import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ messages, loading }) => {
  const bottomRef = useRef(null);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div style={styles.container}>

      {/* All Messages */}
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} />
      ))}

      {/* Loading dots when AI is thinking */}
      {loading && (
        <div style={styles.loadingRow}>
          <div style={styles.loadingBubble}>
            <span style={styles.dot}></span>
            <span style={{ ...styles.dot, animationDelay: '0.2s' }}></span>
            <span style={{ ...styles.dot, animationDelay: '0.4s' }}></span>
          </div>
        </div>
      )}

      {/* This div is used to scroll to bottom */}
      <div ref={bottomRef} />

      {/* CSS Animation for dots */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0px); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 8px'
  },
  loadingRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '0 8px',
    marginBottom: '16px'
  },
  loadingBubble: {
    background: '#2a2a3e',
    borderRadius: '18px 18px 18px 4px',
    padding: '14px 18px',
    display: 'flex',
    gap: '5px',
    alignItems: 'center'
  },
  dot: {
    width: '8px',
    height: '8px',
    background: '#6366f1',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'bounce 1.2s infinite'
  }
};

export default ChatWindow;