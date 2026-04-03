import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuthStore } from '../store/authStore';
import './ChatBot.css';

const ChatBot = () => {
  // Get user information from auth store first
  const { user, token, isAuthenticated } = useAuthStore();
  
  // Only show chatbot for authenticated users
  if (!isAuthenticated) {
    return null;
  }

  // All state declarations
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  
  // All refs
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);
  const dragStartX = useRef(0);
  const currentOffset = useRef(0);
  
  const CHATBOT_API_URL = 'http://localhost:8087';

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Drag handlers for moving chat window
  const handleMouseDown = (e) => {
    if (!isOpen || isMaximized) return;
    // Don't start drag if clicking on buttons inside the header
    if (e.target.closest('button')) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    currentOffset.current = dragOffset;
  };

  useEffect(() => {
    if (!isDragging || !isOpen) return;

    const handleMouseMove = (e) => {
      const pixelsMoved = dragStartX.current - e.clientX;
      const newOffset = currentOffset.current + pixelsMoved;
      const clamped = Math.max(-50, Math.min(250, newOffset));
      
      // Update ref for real-time feedback
      currentOffset.current = clamped;
      setDragOffset(clamped);
      
      // Apply transform directly to DOM for immediate visual feedback
      if (chatWindowRef.current) {
        chatWindowRef.current.style.transform = `translateX(${clamped}px)`;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      
      // Snap to edge
      if (currentOffset.current > 100) {
        setDragOffset(200);
        if (chatWindowRef.current) {
          chatWindowRef.current.style.transform = 'translateX(200px)';
        }
      } else {
        setDragOffset(0);
        if (chatWindowRef.current) {
          chatWindowRef.current.style.transform = 'translateX(0px)';
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isOpen, dragOffset]);

  // Role-based welcome messages
  const getWelcomeMessage = () => {
    const userName = user?.fullName || 'there';
    const role = user?.role || 'PATIENT';
    
    const welcomeMessages = {
      ADMIN: `👋 Hello Admin ${userName}! I'm your Health Atlas AI assistant.\n\nI can help you with:\n• 📋 Viewing pending user approvals\n• 👥 Managing patients and doctors\n• 📊 System statistics and insights\n• ❓ Administrative tasks and decisions`,
      DOCTOR: `👋 Hello Dr. ${userName}! I'm your Health Atlas AI assistant.\n\nI can help you with:\n• 👥 Looking up patient information\n• 📄 Viewing medical records and summaries\n• 🔍 Searching patients by organ/condition\n• 📝 Managing consent requests\n• ❓ Medical record queries`,
      PATIENT: `👋 Hello ${userName}! I'm your Health Atlas AI assistant.\n\nI can help you with:\n• ⚕️ Information about your doctors\n• 📄 Viewing your medical records\n• ✅ Managing consent requests\n• 📤 Understanding your health data\n• ❓ General health questions`
    };
    
    return welcomeMessages[role] || welcomeMessages.PATIENT;
  };

  // Role-based quick actions
  const getQuickActions = () => {
    const role = user?.role || 'PATIENT';
    
    const actions = {
      ADMIN: [
        { label: '📋 Pending approvals', query: 'Show me all pending user approvals' },
        { label: '👥 All patients', query: 'List all patients' },
        { label: '⚕️ All doctors', query: 'Show me all doctors' },
        { label: '❓ Help', query: 'What can you help me with?' },
      ],
      DOCTOR: [
        { label: '👥 My patients', query: 'Show me all patients' },
        { label: '📝 Pending consents', query: 'Show me pending consent requests' },
        { label: '🔍 Search by organ', query: 'Search patients by heart' },
        { label: '❓ Help', query: 'What can you help me with?' },
      ],
      PATIENT: [
        { label: '⚕️ My doctors', query: 'Show me my doctors' },
        { label: '📄 My records', query: 'Show me my medical records' },
        { label: '✅ My consents', query: 'Show me my consent requests' },
        { label: '❓ Help', query: 'What can you help me with?' },
      ]
    };
    
    return actions[role] || actions.PATIENT;
  };

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: getWelcomeMessage(),
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare request body with user session information
      const requestBody = {
        messages: [
          ...messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          { role: 'user', content: input }
        ]
      };

      // Add user context if authenticated
      if (isAuthenticated && user && token) {
        requestBody.user_role = user.role;
        requestBody.user_token = token;
        // Use profileId for doctors and patients (doctor_id/patient_id), userId for admins
        requestBody.user_id = user.profileId || user.userId || user.id;
      }

      const response = await fetch(`${CHATBOT_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();
      
      const botMessage = {
        role: 'assistant',
        content: data.response || data.message || 'I apologize, but I couldn\'t process that request.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error communicating with chatbot:', error);
      const errorMessage = {
        role: 'assistant',
        content: '❌ Sorry, I\'m having trouble connecting to the chatbot service. Please make sure the chatbot server is running on port 8087.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = getQuickActions();

  const handleQuickAction = (query) => {
    setInput(query);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className="floating-chat-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Sidebar Overlay */}
      <div 
        className={`chat-sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Chat Sidebar */}
      <div 
        className={`chat-window ${isOpen ? 'open' : ''} ${isDragging ? 'dragging' : ''} ${isMaximized ? 'maximized' : ''}`}
        ref={chatWindowRef}
        style={{
          transform: isOpen ? `translateX(${isMaximized ? 0 : dragOffset}px)` : 'translateX(100%)'
        }}
      >
        <div 
          className="chat-header"
          onMouseDown={!isMaximized ? handleMouseDown : undefined}
          style={{ cursor: isMaximized ? 'default' : isDragging ? 'grabbing' : 'grab' }}
        >
          {!isMaximized && <span className="drag-indicator" title="Drag to reposition">↔</span>}
          <h3>🏥 Health Atlas AI Assistant</h3>
          <div className="header-actions">
            <button
              onClick={() => { setIsMaximized(m => !m); setDragOffset(0); }}
              className="maximize-button"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="4" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M4 4V2a1 1 0 011-1h7a1 1 0 011 1v7a1 1 0 01-1 1h-2" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M5 1v4H1M9 1v4h4M5 13V9H1M9 13V9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </button>
            <button onClick={() => { setIsOpen(false); setIsMaximized(false); }} className="close-button">✕</button>
          </div>
        </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className={`message-content ${message.role === 'assistant' ? 'markdown-content' : ''}`}>
                  {message.role === 'assistant' ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    message.content
                  )}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message bot-message">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="quick-actions">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="quick-action-btn"
                  onClick={() => handleQuickAction(action.query)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          <form className="chat-input-form" onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={!input.trim() || isLoading}
            >
              ➤
            </button>
          </form>
        </div>
    </>
  );
};

export default ChatBot;
