const BudgetTracker = ({ budget, spent }) => {
  const remaining = budget - spent;
  const percentUsed = budget > 0 ? (spent / budget) * 100 : 0;

  // Change color based on how much is left
  const barColor = percentUsed > 80 ? '#ef4444'   // red
    : percentUsed > 50 ? '#f59e0b'                 // orange  
    : '#22c55e';                                    // green

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>💰 Budget Tracker</h3>

      {/* Three budget numbers */}
      <div style={styles.row}>
        <span style={styles.label}>Total Budget</span>
        <span style={styles.value}>
          ₹{budget.toLocaleString('en-IN')}
        </span>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>Spent</span>
        <span style={{ ...styles.value, color: '#ef4444' }}>
          ₹{spent.toLocaleString('en-IN')}
        </span>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>Remaining</span>
        <span style={{ ...styles.value, color: barColor }}>
          ₹{remaining.toLocaleString('en-IN')}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={styles.barBackground}>
        <div style={{
          ...styles.barFill,
          width: `${Math.min(percentUsed, 100)}%`,
          backgroundColor: barColor
        }} />
      </div>

      <p style={styles.percent}>{Math.round(percentUsed)}% used</p>

      {/* Warnings */}
      {remaining <= 0 && (
        <p style={styles.danger}>🚫 Budget khatam ho gaya!</p>
      )}
      {remaining > 0 && remaining < budget * 0.2 && (
        <p style={styles.warning}>⚠️ Budget khatam hone wala hai!</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '16px',
    background: '#1e1e2e',
    borderRadius: '12px',
    marginBottom: '16px'
  },
  title: {
    margin: '0 0 12px',
    color: '#ffffff',
    fontSize: '15px'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  label: {
    color: '#888888',
    fontSize: '13px'
  },
  value: {
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 'bold'
  },
  barBackground: {
    height: '10px',
    background: '#333333',
    borderRadius: '9999px',
    overflow: 'hidden',
    margin: '10px 0 4px'
  },
  barFill: {
    height: '100%',
    borderRadius: '9999px',
    transition: 'width 0.5s ease'
  },
  percent: {
    color: '#666666',
    fontSize: '12px',
    margin: '0'
  },
  warning: {
    color: '#f59e0b',
    fontSize: '13px',
    margin: '8px 0 0'
  },
  danger: {
    color: '#ef4444',
    fontSize: '13px',
    margin: '8px 0 0'
  }
};

export default BudgetTracker;