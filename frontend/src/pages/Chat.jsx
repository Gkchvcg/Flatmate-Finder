import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { Send, ArrowLeft, Sparkles } from 'lucide-react';

const Chat = () => {
  const { pairId } = useParams();
  const { user } = useContext(AuthContext);
  const [chat, setChat] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [icebreakers, setIcebreakers] = useState([]);
  const [loadingIcebreakers, setLoadingIcebreakers] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [aiReply, setAiReply] = useState('');
  // AI chat: send prompt to backend and get AI response
  const handleAISend = async () => {
    if (!text.trim()) return;
    setAiThinking(true);
    setAiReply('');
    try {
      const res = await api.post('/generative/chat', { prompt: text });
      setAiReply(res.data.output);
    } catch (err) {
      setAiReply('AI error: ' + (err.response?.data?.message || err.message));
    } finally {
      setAiThinking(false);
    }
  };
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  const fetchChat = async () => {
    try {
      const res = await api.get(`/chats/${pairId}`);
      setChat(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch chat error', err);
    }
  };

  useEffect(() => {
    fetchChat();
    const iv = setInterval(fetchChat, 2000); // simple polling
    return () => clearInterval(iv);
  }, [pairId]);

  useEffect(() => {
    const fetchIcebreakers = async () => {
      if (chat && chat.messages && chat.messages.length === 0 && chat.participants.length > 1) {
        const currentUserId = (user._id || user.id).toString();
        const otherUser = chat.participants.find(p => (p._id || p).toString() !== currentUserId);
        if(!otherUser) return;
        setLoadingIcebreakers(true);
        try {
          const res = await api.get(`/ai/icebreakers?user1Id=${currentUserId}&user2Id=${(otherUser._id || otherUser)}`);
          setIcebreakers(res.data.icebreakers || []);
        } catch(err) {
          console.error('Failed to get icebreakers', err);
        } finally {
          setLoadingIcebreakers(false);
        }
      }
    };
    fetchIcebreakers();
  }, [chat?.messages?.length, chat?.participants]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post(`/chats/${pairId}/messages`, { text });
      setText('');
      inputRef.current.focus();
      fetchChat();
    } catch (err) {
      console.error('Send message error', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading chat...</div>
      </div>
    );
  }

  const currentUserId = (user._id || user.id).toString();
  const partner = chat?.participants?.find(p => (p._id || p).toString() !== currentUserId);
  const partnerName = (typeof partner === 'object' ? partner?.name : null) || chat?.messages?.find(m => (m.sender?._id || m.sender).toString() !== currentUserId)?.sender?.name || "Chat Partner";

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', paddingTop: '1rem' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.5rem', borderRadius: '1rem 1rem 0 0', borderBottom: 'none' }}>
        <Link to="/matches" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginRight: '1rem' }}>
          <ArrowLeft size={20} />
        </Link>
        <div style={{ 
          width: '40px', height: '40px', borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--primary-color), #7C3AED)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 'bold', marginRight: '1rem'
        }}>
          {partnerName.charAt(0).toUpperCase()}
        </div>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>{partnerName}</h2>
      </div>

      {/* Messages Area */}
      <div 
        className="glass-card" 
        ref={scrollRef} 
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '1.5rem',
          borderRadius: '0',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--glass-bg)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {chat && chat.messages && chat.messages.length > 0 ? (
          chat.messages.map((m) => {
            const mSenderId = (m.sender?._id || m.sender).toString();
            const isMe = currentUserId === mSenderId;
            return (
              <div key={m._id} style={{ 
                marginBottom: '1rem', 
                display: 'flex', 
                flexDirection: isMe ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: '0.5rem'
              }}>
                <div style={{ 
                  maxWidth: '75%', 
                  background: isMe ? 'var(--primary-color)' : 'var(--card-bg)', 
                  color: isMe ? 'white' : 'var(--text-main)',
                  padding: '0.75rem 1rem', 
                  borderRadius: isMe ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  border: isMe ? 'none' : '1px solid var(--border-color)'
                }}>
                  <div style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>{m.text}</div>
                  <div style={{ 
                    fontSize: '0.7rem', 
                    color: isMe ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', 
                    marginTop: '0.3rem',
                    textAlign: isMe ? 'right' : 'left'
                  }}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
            <p style={{ marginBottom: '2rem' }}>No messages yet. Say hi to your new flatmate!</p>
            
            <div style={{ width: '100%', maxWidth: '500px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                <span style={{ fontSize: '1.2rem' }}>✨</span> <strong style={{ fontSize: '0.9rem' }}>AI Icebreaker Suggestions</strong>
              </div>
              {loadingIcebreakers ? (
                <div style={{ fontSize: '0.8rem', fontStyle: 'italic', opacity: 0.7 }}>Generating personalized icebreakers based on your shared interests...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {icebreakers.map((ib, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setText(ib)}
                      style={{ 
                        background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
                        padding: '0.75rem', borderRadius: '0.5rem', textAlign: 'left', 
                        cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-main)',
                        transition: 'border-color 0.2s',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                      onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    >
                      {ib}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="glass-card" style={{ padding: '1rem', borderRadius: '0 0 1rem 1rem', borderTop: 'none' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="form-control"
            style={{ flex: 1, borderRadius: '999px', padding: '0.75rem 1.25rem' }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ borderRadius: '50%', width: '48px', height: '48px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            disabled={!text.trim()}
          >
            <Send size={20} style={{ marginLeft: '-2px' }} />
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ borderRadius: '50%', width: '48px', height: '48px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '0.5rem' }}
            onClick={handleAISend}
            disabled={aiThinking || !text.trim()}
            title="Ask AI for a reply"
          >
            {aiThinking ? <Sparkles size={20} className="spin" /> : <Sparkles size={20} />}
          </button>
        </form>
        {aiReply && (
          <div style={{ marginTop: '0.75rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.75rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>AI:</span> {aiReply}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Chat;
