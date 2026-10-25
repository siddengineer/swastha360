import React from 'react';
import type { Agent } from '../types';
import { 
  CalendarCheck, 
  Pill, 
  Calendar, 
  Activity, 
  HeartHandshake, 
  ShieldCheck, 
  HelpCircle, 
  Smile, 
  Languages, 
  Bot, 
  Sparkles, 
  ChevronRight, 
  Lock,
  Building2,
  User
} from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  onTryDemo: (agent: Agent) => void;
  onViewDetails: (agent: Agent) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onTryDemo, onViewDetails }) => {
  const getIcon = () => {
    switch (agent.iconName) {
      case 'CalendarCheck': return <CalendarCheck className="w-6 h-6 text-teal-600" />;
      case 'Pill': return <Pill className="w-6 h-6 text-emerald-600" />;
      case 'Calendar': return <Calendar className="w-6 h-6 text-sky-600" />;
      case 'Activity': return <Activity className="w-6 h-6 text-rose-600" />;
      case 'HeartHandshake': return <HeartHandshake className="w-6 h-6 text-pink-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-indigo-600" />;
      case 'HelpCircle': return <HelpCircle className="w-6 h-6 text-amber-600" />;
      case 'Smile': return <Smile className="w-6 h-6 text-violet-600" />;
      case 'Languages': return <Languages className="w-6 h-6 text-cyan-600" />;
      default: return <Bot className="w-6 h-6 text-brand-600" />;
    }
  };

  const getAvailabilityBadge = () => {
    switch (agent.defaultAvailability) {
      case 'Available for Hospital':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Building2 className="w-3 h-3" />
            <span>Hospital Only</span>
          </span>
        );
      case 'Available for Individuals':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <User className="w-3 h-3" />
            <span>Individuals & B2C</span>
          </span>
        );
      case 'Available in Demo':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
            <Sparkles className="w-3 h-3" />
            <span>Available in Demo</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between p-6 group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
            {getIcon()}
          </div>
          {getAvailabilityBadge()}
        </div>

        {/* Title & Category */}
        <div className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">{agent.category}</div>
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2">
          {agent.name}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {agent.description}
        </p>

        {/* Intended Users */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-600 mb-5">
          <span className="font-semibold text-slate-900">Target Role:</span> {agent.intendedUsers}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center space-x-2">
        <button
          onClick={() => onViewDetails(agent)}
          className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
        >
          View Details
        </button>
        <button
          onClick={() => onTryDemo(agent)}
          className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center space-x-1 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Try Demo</span>
        </button>
      </div>
    </div>
  );
};
