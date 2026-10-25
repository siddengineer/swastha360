import React, { useState, useEffect, useRef } from 'react';
import type { Agent, ChatMessage, EscalationInfo } from '../types';
import { api } from '../services/api';
import { 
  Send, 
  Trash2, 
  ShieldAlert, 
  Sparkles, 
  Bot, 
  User, 
  Languages, 
  Clock, 
  Calendar, 
  Pill, 
  HeartHandshake, 
  Smile, 
  HelpCircle, 
  Activity, 
  CalendarCheck, 
  CheckCircle2, 
  AlertTriangle,
  PhoneCall
} from 'lucide-react';

interface AgentDemoChatProps {
  agent: Agent;
  initialMessage?: string;
  onClose?: () => void;
}

export const AgentDemoChat: React.FC<AgentDemoChatProps> = ({ agent, initialMessage, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [activeConversationId, setActiveConversationId] = useState<number | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Map icon
  const getAgentIcon = (name: string) => {
    switch (name) {
      case 'CalendarCheck': return <CalendarCheck className="w-6 h-6 text-teal-600" />;
      case 'Pill': return <Pill className="w-6 h-6 text-emerald-600" />;
      case 'Calendar': return <Calendar className="w-6 h-6 text-sky-600" />;
      case 'Activity': return <Activity className="w-6 h-6 text-rose-600" />;
      case 'HeartHandshake': return <HeartHandshake className="w-6 h-6 text-pink-600" />;
      case 'ShieldCheck': return <ShieldAlert className="w-6 h-6 text-indigo-600" />;
      case 'HelpCircle': return <HelpCircle className="w-6 h-6 text-amber-600" />;
      case 'Smile': return <Smile className="w-6 h-6 text-violet-600" />;
      case 'Languages': return <Languages className="w-6 h-6 text-cyan-600" />;
      default: return <Bot className="w-6 h-6 text-brand-600" />;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Initial welcome message
  useEffect(() => {
    const welcomeText = `Namaste! I am the **${agent.name}**.\n\n${agent.description}\n\nYou can click any sample prompt below or type your inquiry.`;
    setMessages([
      {
        id: 'welcome',
        sender: 'agent',
        content: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        safetyNotice: 'Swasth360 is an AI-assisted healthcare demo. It does not provide medical diagnosis or replace a doctor.',
        modelUsed: 'Swasth360 Healthcare Intelligence'
      }
    ]);

    if (initialMessage) {
      sendMessage(initialMessage);
    }
  }, [agent.id]);

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.agents.chat(agent.id, text, activeConversationId, language);
      if (res.conversationId) {
        setActiveConversationId(res.conversationId);
      }

      const agentMsg: ChatMessage = {
        id: 'agent-' + Date.now(),
        sender: 'agent',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionData: res.actionData,
        escalation: res.escalation,
        safetyNotice: res.safetyNotice,
        modelUsed: res.modelUsed
      };

      setMessages(prev => [...prev, agentMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'agent',
          content: `Unable to process request: ${err.message || 'Service unavailable'}. Please verify your network connection.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          safetyNotice: 'Service Error Notice'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'agent',
        content: `Conversation refreshed with **${agent.name}**. How can I help you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setActiveConversationId(undefined);
  };

  const getSuggestedPrompts = () => {
    switch (agent.id) {
      case 'patient-followup':
        return [
          "Draft a 48-hour post-discharge follow-up reminder",
          "View pending post-op follow-up schedule",
          "Show cardiology review checklist for follow-up"
        ];
      case 'medication-guidance':
        return [
          "Explain what 'take with food' means for Paracetamol/Metformin",
          "Difference between a prescribed dose and general OTC advice",
          "What should I do if I missed a morning dose?"
        ];
      case 'appointment-management':
        return [
          "Draft an SMS appointment reminder for tomorrow's orthopedic OPD",
          "Show today's upcoming demo OPD slots",
          "What documents should a patient bring for a first-time specialist visit?"
        ];
      case 'chronic-care':
        return [
          "Show routine care checklist for Type 2 Diabetes",
          "How often should blood pressure be logged for hypertension?",
          "Lifestyle habits to support cardiovascular wellness"
        ];
      case 'maternal-child':
        return [
          "Show 2nd trimester prenatal wellness checklist",
          "Essential immunization milestones for infants in India (0-12 months)",
          "What are critical red-flag symptoms during pregnancy?"
        ];
      case 'insurance-ayushman':
        return [
          "What documents are typically needed for Ayushman Bharat PM-JAY verification?",
          "Explain common health insurance pre-authorization workflows",
          "What is the difference between cashless treatment and reimbursement claim?"
        ];
      case 'hospital-helpdesk':
        return [
          "What are the hospital visiting hours for ICU and general wards?",
          "How do I reach the hospital emergency counter or reception?",
          "What is the admission procedure for planned day-care procedures?"
        ];
      case 'mental-wellness':
        return [
          "Guide me through a 2-minute box breathing relaxation exercise",
          "I am feeling overwhelmed with work stress today",
          "What are healthy grounding techniques when anxious?"
        ];
      case 'multilingual-healthcare':
        return [
          "Explain 'Take empty stomach before breakfast' in Hindi",
          "दवा लेने से पहले क्या सावधानियां रखनी चाहिए?",
          "रक्त तपासणीसाठी उपाशी पोटी यावे लागेल का? (Explain in Marathi)"
        ];
      default:
        return [
          "Explain the key functions of this agent",
          "Show a sample healthcare workflow"
        ];
    }
  };

  return (
    <div className="flex flex-col h-[650px] max-h-[85vh] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            {getAgentIcon(agent.iconName)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base leading-tight text-white">{agent.name}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Demo Mode — Sample Data
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{agent.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language selector for multilingual agent */}
          {agent.id === 'multilingual-healthcare' && (
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="en">English (Default)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          )}

          <button
            onClick={handleClear}
            title="Clear Chat"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors ml-2"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Safety Banner */}
      <div className="px-6 py-2 bg-amber-50 border-b border-amber-200/80 flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Safety Notice:</strong> For educational & workflow demonstration only. Not for clinical diagnosis or emergency care.
          </span>
        </div>
        <span className="hidden sm:inline font-semibold text-amber-700">Emergency: 112 / 108</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-slate-800 text-white'
                  : 'bg-brand-600 text-white shadow-sm'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[82%] space-y-2`}>
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none shadow-sm'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                {/* Message Body */}
                <div className="whitespace-pre-line prose prose-sm max-w-none">
                  {msg.content}
                </div>

                {/* Crisis Escalation Card if detected */}
                {msg.escalation && msg.escalation.crisis && (
                  <div className="mt-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900">
                    <div className="flex items-center space-x-2 font-bold text-rose-700 text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Immediate Support Helpline</span>
                    </div>
                    <p className="text-xs mt-1 text-rose-800">
                      {msg.escalation.helplineName}: <strong>{msg.escalation.helplineNumber}</strong> (Free 24x7)
                    </p>
                    <a
                      href={`tel:${msg.escalation.helplineNumber}`}
                      className="mt-2 inline-flex items-center space-x-1 px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Tele-MANAS ({msg.escalation.helplineNumber})</span>
                    </a>
                  </div>
                )}

                {/* Action Data Preview Card */}
                {msg.actionData && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 text-slate-700">
                    <div className="flex items-center justify-between text-slate-900 font-semibold border-b border-slate-200 pb-1">
                      <span className="flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                        <span>Structured Action Payload</span>
                      </span>
                      <span className="text-[10px] text-brand-600 font-mono">DEMO OUTPUT</span>
                    </div>
                    {Object.entries(msg.actionData).map(([k, v]) => (
                      <div key={k} className="flex justify-between py-0.5">
                        <span className="text-slate-500 capitalize">{k.replace(/_/g, ' ')}:</span>
                        <span className="font-medium text-slate-900 truncate max-w-[200px]">
                          {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Timestamp & Model Used */}
              <div
                className={`flex items-center space-x-2 text-[10px] text-slate-400 px-1 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.modelUsed && (
                  <>
                    <span>•</span>
                    <span className="text-slate-500 font-medium">{msg.modelUsed}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse delay-150"></div>
              <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse delay-300"></div>
              <span className="text-xs text-slate-500 ml-1">Analyzing healthcare guidelines...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1 flex items-center">
            <Sparkles className="w-3 h-3 text-brand-600 mr-1" />
            Suggestions:
          </span>
          {getSuggestedPrompts().map((p, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(p)}
              disabled={loading}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-white hover:bg-brand-50 text-slate-700 hover:text-brand-700 border border-slate-200 hover:border-brand-300 shrink-0 transition-all shadow-2xs"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="p-4 bg-white border-t border-slate-200 flex items-center space-x-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Type demo inquiry for ${agent.name}...`}
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-sm shadow-sm transition-all"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
