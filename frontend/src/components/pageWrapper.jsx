export default function PageWrapper({ children, title }) {
  return (
    <div style={styles.wrapper}>
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '32px 24px',
  }
};