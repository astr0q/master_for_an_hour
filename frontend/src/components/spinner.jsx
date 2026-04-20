export default function Spinner() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.spinner} />
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: '48px 0',
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '4px solid #e0e0e0',
    borderTop: '4px solid #89b4fa',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  }
};

// inject keyframe once
const style = document.createElement('style');
style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);