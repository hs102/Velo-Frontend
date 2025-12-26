/**
 * ChatBot component with circular button and modal chat interface
 */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { sendMessage } from '../../services/chatbotService';
import styles from './ChatBot.module.css';

const ChatBot = ({ context = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hi! I can help you with your projects and tasks. What would you like to know?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Send message to backend
      const response = await sendMessage(input, context);
      
      // Add bot response to chat
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: response.response || response.message || 'Sorry, I could not process that request.'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        error: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      console.error('Chatbot error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      { id: 1, type: 'bot', text: 'Hi! I can help you with your projects and tasks. What would you like to know?' }
    ]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className={styles.chatButton}
        onClick={() => setIsOpen(!isOpen)}
        title="Open chatbot"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h3>Chat Assistant</h3>
            <div className={styles.headerActions}>
              <button
                className={styles.clearBtn}
                onClick={handleClear}
                title="Clear chat history"
              >
                ↻
              </button>
              <button
                className={styles.closeBtn}
                onClick={() => setIsOpen(false)}
                title="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          <div className={styles.messagesContainer}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${styles[msg.type]} ${msg.error ? styles.error : ''}`}
              >
                <div className={styles.messageBubble}>
                  {msg.type === 'bot' ? (
                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => <p style={{ margin: 0 }} {...props} />,
                        ul: ({ node, ...props }) => <ul style={{ marginTop: 0, marginBottom: 0, paddingLeft: '1.25rem' }} {...props} />,
                        ol: ({ node, ...props }) => <ol style={{ marginTop: 0, marginBottom: 0, paddingLeft: '1.25rem' }} {...props} />,
                        li: ({ node, ...props }) => <li style={{ marginBottom: '0.25rem' }} {...props} />,
                        code: ({ node, inline, ...props }) => 
                          inline ? (
                            <code style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '0.2rem 0.4rem', borderRadius: '3px', fontFamily: 'monospace' }} {...props} />
                          ) : (
                            <code style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.1)', padding: '0.5rem', borderRadius: '3px', fontFamily: 'monospace', overflow: 'auto' }} {...props} />
                          )
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className={`${styles.message} ${styles.bot}`}>
                <div className={styles.messageBubble}>
                  <span className={styles.typingDots}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className={styles.inputForm} onSubmit={handleSendMessage}>
            <input
              type="text"
              className={styles.messageInput}
              placeholder="Ask about your projects and tasks..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={loading || !input.trim()}
              title="Send message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

ChatBot.propTypes = {
  context: PropTypes.shape({
    projects: PropTypes.array,
    tasks: PropTypes.array
  })
};

export default ChatBot;
