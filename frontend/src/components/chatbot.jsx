import { useState, useRef, useEffect } from 'react';
import { SYSTEM_PROMPT } from '../chatbot/knowledge';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I am the Master for an Hour assistant. Ask me anything about how to use the app, or type your question below.',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'Master for an Hour',
        },
        body: JSON.stringify({
          model: 'nvidia/nemotron-3-super-120b-a12b:free',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...updatedMessages,
          ],
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't get a response. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Connection error. Please try again or contact support@masterforhour.com"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* floating button */}
      <button onClick={() => setOpen(!open)} style={styles.fab} title="Chat support">
        {open ? '✕' : '💬'}
      </button>

      {/* chat window */}
      {open && (
        <div style={styles.window}>
          {/* header */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.avatar}>🔧</div>
              <div>
                <div style={styles.headerTitle}>Support Assistant</div>
                <div style={styles.headerSub}>Master for an Hour</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={styles.closeBtn}>✕</button>
          </div>

          {/* messages */}
          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                ...styles.bubble,
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.role === 'user' ? '#2E75B6' : '#f0f0f0',
                color: msg.role === 'user' ? 'white' : '#1e1e2e',
              }}>
                {msg.content}
              </div>
            ))}

            {loading && (
              <div style={{ ...styles.bubble, alignSelf: 'flex-start', backgroundColor: '#f0f0f0', color: '#888' }}>
                <span style={styles.typing}>● ● ●</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* quick questions */}
          <div style={styles.quickBar}>
            {['How do I register?', 'How to create a request?', 'What do statuses mean?'].map(q => (
              <button key={q} style={styles.quickBtn} onClick={() => {
                setInput(q);
              }}>
                {q}
              </button>
            ))}
          </div>

          {/* input */}
          <div style={styles.inputArea}>
            <input
              style={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a question..."
              disabled={loading}
            />
            <button
              style={{
                ...styles.sendBtn,
                opacity: loading || !input.trim() ? 0.5 : 1,
              }}
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  fab: {
    position: 'fixed',
    bottom: '28px',
    right: '28px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#1e1e2e',
    color: 'white',
    border: 'none',
    fontSize: '22px',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s',
  },
  window: {
    position: 'fixed',
    bottom: '96px',
    right: '28px',
    width: '360px',
    height: '500px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    zIndex: 9998,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid #e0e0e0',
  },
  header: {
    backgroundColor: '#1e1e2e',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  headerTitle: {
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
  },
  headerSub: {
    color: '#a0c0e0',
    fontSize: '11px',
    fontFamily: 'Arial, sans-serif',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '4px',
    opacity: 0.7,
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: '#fafafa',
  },
  bubble: {
    maxWidth: '80%',
    padding: '10px 14px',
    borderRadius: '14px',
    fontSize: '13px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.5',
    wordBreak: 'break-word',
    backgroundColor: '#fafafa'
  },
  typing: {
    fontSize: '10px',
    letterSpacing: '3px',
    animation: 'pulse 1.2s infinite',
  },
  quickBar: {
    display: 'flex',
    gap: '6px',
    padding: '8px 12px',
    overflowX: 'auto',
    backgroundColor: 'white',
    borderTop: '1px solid #eee',
  },
  quickBtn: {
    whiteSpace: 'nowrap',
    padding: '4px 10px',
    borderRadius: '12px',
    border: '1px solid #2E75B6',
    backgroundColor: 'white',
    color: '#1e1e2e',
    fontSize: '11px',
    cursor: 'pointer',
    fontFamily: 'Arial, sans-serif',
  },
  inputArea: {
    display: 'flex',
    gap: '8px',
    padding: '10px 12px',
    borderTop: '1px solid #eee',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '20px',
    border: '1px solid #ddd',
    fontSize: '13px',
    fontFamily: 'Arial, sans-serif',
    outline: 'none',
  },
  sendBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#1e1e2e',
    color: 'white',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};