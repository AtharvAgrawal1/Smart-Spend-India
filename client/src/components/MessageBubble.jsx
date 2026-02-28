import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '16px',
      padding: '0 8px',
      alignItems: 'flex-end',
      gap: '8px'
    }}>

      {/* AI Avatar */}
      {!isUser && (
        <div style={styles.avatar}>🤖</div>
      )}

      {/* Message Box */}
      <div style={{
        maxWidth: '72%',
        padding: '12px 16px',
        borderRadius: isUser 
          ? '18px 18px 4px 18px' 
          : '18px 18px 18px 4px',
        background: isUser ? '#6366f1' : '#2a2a3e',
        color: '#ffffff',
        fontSize: '14px',
        lineHeight: '1.7'
      }}>
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div style={styles.avatar}>👤</div>
      )}

    </div>
  );
};

const styles = {
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#333333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0
  }
};

export default MessageBubble;