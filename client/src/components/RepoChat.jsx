import React, { useState, useRef, useEffect } from 'react';
import { chatWithRepo } from '../services/api.js';

function RepoChat({ repoData }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Hi! I'm your RepoLens Assistant. Ask me anything about the **${repoData?.owner}/${repoData?.repo}** repository! E.g. folder structure, setup steps, how it works, or the tech stack.`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    if (!textToSend) setInput('');

    // Append user message
    const updatedMessages = [...messages, { role: 'user', content: text }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Map frontend messages format to OpenAI api format: { role: 'user'/'assistant', content: '...' }
      const apiMessages = updatedMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      // Call API
      const reply = await chatWithRepo(repoData, apiMessages);

      // Append assistant response
      setMessages(prev => [...prev, { role: 'assistant', content: reply.content || reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `❌ Error: ${err.message || 'Unable to connect to AI assistant.'}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (question) => {
    handleSend(question);
  };

  // Basic markdown-like formatter helper for bullet points, code blocks, bold text
  const formatContent = (text) => {
    if (!text) return '';
    const parts = [];
    const lines = text.split('\n');

    let inCodeBlock = false;
    let codeBlockContent = [];

    lines.forEach((line, index) => {
      // Code block toggles
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // close code block
          parts.push(
            <pre key={`code-${index}`} className="chat-code-block">
              <code>{codeBlockContent.join('\n')}</code>
            </pre>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          // open code block
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Check if it's a bullet point
      const bulletMatch = line.match(/^[\s]*[-*+]\s+(.*)/);
      if (bulletMatch) {
        parts.push(
          <li key={`bullet-${index}`} className="chat-bullet">
            {parseInlineStyles(bulletMatch[1])}
          </li>
        );
        return;
      }

      // Check if empty line
      if (!line.trim()) {
        parts.push(<div key={`space-${index}`} className="chat-space" />);
        return;
      }

      // Default paragraph
      parts.push(
        <p key={`p-${index}`} className="chat-paragraph">
          {parseInlineStyles(line)}
        </p>
      );
    });

    return parts;
  };

  // Helper to parse bold (**text**) and inline code (`code`)
  const parseInlineStyles = (text) => {
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="chat-inline-code">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const suggestions = [
    "How do I install & run this locally?",
    "Explain the folder structure simply.",
    "What database/APIs does it use?",
    "Are there any tests in this project?"
  ];

  return (
    <div className="repo-chat-card card">
      <div className="chat-header">
        <div className="chat-title-group">
          <div className="chat-icon-avatar">🤖</div>
          <div>
            <h3 className="chat-title">RepoLens Assistant</h3>
            <span className="chat-subtitle">Ask me anything about this codebase</span>
          </div>
        </div>
        <div className="chat-status-indicator">
          <span className="indicator-dot"></span> Live Chat
        </div>
      </div>

      <div className="chat-messages-container">
        {messages.map((m, idx) => (
          <div key={idx} className={`chat-message-bubble ${m.role}`}>
            <div className="message-avatar">{m.role === 'assistant' ? '🤖' : '👤'}</div>
            <div className="message-content">
              {m.role === 'assistant' ? (
                <div className="assistant-text-formatted">{formatContent(m.content)}</div>
              ) : (
                <p className="user-text">{m.content}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-message-bubble assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content loading-bubble">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-suggestions-container">
        <span className="suggestions-label">Popular Questions:</span>
        <div className="suggestions-chips-group">
          {suggestions.map((s, i) => (
            <button 
              key={i} 
              className="suggestion-chip" 
              onClick={() => handleSuggestion(s)}
              disabled={loading}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }} 
        className="chat-input-container"
      >
        <input
          type="text"
          className="chat-text-input"
          placeholder="Ask a question about this repository..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button 
          type="submit" 
          className="btn btn-primary chat-send-btn"
          disabled={loading || !input.trim()}
        >
          <i className="fa-solid fa-paper-plane"></i> Send
        </button>
      </form>

      <style>{`
        .repo-chat-card {
          background-color: var(--bg-card);
          padding: 24px;
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }

        .repo-chat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
          padding-bottom: 16px;
          margin-bottom: 20px;
        }

        .chat-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-icon-avatar {
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, rgba(88, 166, 255, 0.15) 0%, rgba(188, 140, 255, 0.15) 100%);
          border: 1px solid rgba(88, 166, 255, 0.25);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(88, 166, 255, 0.1);
        }

        .chat-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        .chat-subtitle {
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .chat-status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--accent-green);
          background-color: rgba(63, 185, 80, 0.1);
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid rgba(63, 185, 80, 0.15);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--accent-green);
          animation: pulseGreen 2s infinite;
        }

        @keyframes pulseGreen {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(63, 185, 80, 0.5);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 6px rgba(63, 185, 80, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(63, 185, 80, 0);
          }
        }

        .chat-messages-container {
          min-height: 240px;
          max-height: 420px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-right: 8px;
          margin-bottom: 20px;
        }

        .chat-messages-container::-webkit-scrollbar {
          width: 5px;
        }
        .chat-messages-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-messages-container::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 10px;
        }
        .chat-messages-container::-webkit-scrollbar-thumb:hover {
          background: var(--text-secondary);
        }

        /* Message Bubbles */
        .chat-message-bubble {
          display: flex;
          gap: 14px;
          max-width: 85%;
          animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chat-message-bubble.assistant {
          align-self: flex-start;
        }

        .chat-message-bubble.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.05rem;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }

        .message-content {
          border-radius: 14px;
          padding: 14px 18px;
          font-size: 0.94rem;
          line-height: 1.58;
          letter-spacing: -0.005em;
        }

        .assistant .message-content {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          color: var(--text-primary);
          border-top-left-radius: 2px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .user .message-content {
          background: linear-gradient(135deg, rgba(88, 166, 255, 0.08) 0%, rgba(188, 140, 255, 0.08) 100%);
          border: 1px solid rgba(88, 166, 255, 0.25);
          color: var(--text-primary);
          border-top-right-radius: 2px;
          box-shadow: 0 4px 12px rgba(88, 166, 255, 0.04);
        }

        .user-text {
          margin: 0;
          font-weight: 500;
          white-space: pre-wrap;
        }

        /* Assistant formatting styles */
        .assistant-text-formatted p {
          margin: 0 0 12px 0;
        }
        .assistant-text-formatted p:last-child {
          margin-bottom: 0;
        }
        
        .chat-bullet {
          margin-left: 20px;
          margin-bottom: 8px;
          list-style-type: none;
          position: relative;
        }
        .chat-bullet::before {
          content: '✦';
          color: var(--accent-blue);
          position: absolute;
          left: -16px;
          font-size: 0.8rem;
        }
        
        .chat-code-block {
          background-color: #0d1117;
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 14px;
          font-family: 'Space Grotesk', monospace;
          font-size: 0.85rem;
          overflow-x: auto;
          margin: 12px 0;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .chat-inline-code {
          background-color: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.9em;
          color: var(--accent-purple);
        }
        
        .chat-space {
          height: 12px;
        }

        /* Loading indicator bubble */
        .loading-bubble {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 14px 20px;
        }

        .loading-bubble .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--text-secondary);
          animation: wave 1.3s linear infinite;
        }

        .loading-bubble .dot:nth-child(2) {
          animation-delay: -1.1s;
        }

        .loading-bubble .dot:nth-child(3) {
          animation-delay: -0.9s;
        }

        @keyframes wave {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-6px);
          }
        }

        /* Suggestions chips */
        .chat-suggestions-container {
          border-top: 1px solid var(--border);
          padding-top: 18px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .suggestions-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .suggestions-chips-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .suggestion-chip {
          background: rgba(88, 166, 255, 0.03);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          border-radius: 20px;
          padding: 8px 16px;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .suggestion-chip:hover {
          background: rgba(88, 166, 255, 0.08);
          border-color: var(--accent-blue);
          color: var(--text-primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(88, 166, 255, 0.1);
        }

        /* Input Container */
        .chat-input-container {
          display: flex;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 6px 6px 6px 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .chat-input-container:focus-within {
          border-color: var(--accent-blue);
          box-shadow: 0 0 12px rgba(88, 166, 255, 0.1);
        }

        .chat-text-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.95rem;
        }
        .chat-text-input::placeholder {
          color: var(--text-secondary);
        }

        .chat-send-btn {
          padding: 10px 20px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

export default RepoChat;
