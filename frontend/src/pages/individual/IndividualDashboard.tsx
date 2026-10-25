import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { IndividualDashboardData, Agent } from '../../types';
import { AgentDemoChat } from '../../components/AgentDemoChat';
import { 
  User, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  MessageSquare, 
  ArrowRight,
  Heart,
  Pill,
  Activity,
  Smile,
  ShieldAlert
} from 'lucide-react';

export const IndividualDashboard: React.FC = () => {
  const [data, setData] = useState<IndividualDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDemoAgent, setActiveDemoAgent] = useState<Agent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.individual.getDashboard()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load dashboard.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-12 flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading individual health portal...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Access Issue</h2>
          <p className="text-xs text-slate-600">{error || 'Unable to fetch your personal dashboard.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                Personal Health Portal (B2C)
              </span>
              <span className="text-xs text-slate-400 font-mono">Independent Citizen Account</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Namaste, {data.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Your private personal health assistance workspace. Explore specialized agents with zero hospital dependency.
            </p>
          </div>
        </div>

        {/* Safety & Non-Affiliation Notice */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs text-slate-600 flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-900">Independent Citizen Account</p>
            <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
              Your account is completely independent of any hospital or clinical organization. You do not need hospital authorization to use these AI agents. Your interactions remain private to your account.
            </p>
          </div>
        </div>

        {/* Available Citizen Agents */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Available AI Agents for You</h2>
              <p className="text-xs text-slate-500">Select an agent to launch an interactive guidance session</p>
            </div>
            <span className="text-xs font-semibold text-brand-600">{data.availableAgents.length} Agents Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.availableAgents.map(agent => (
              <div
                key={agent.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-brand-300 transition-all group"
              >
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{agent.category}</span>
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-brand-600 transition-colors">{agent.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{agent.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => setActiveDemoAgent(agent)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Start Consultation Demo</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Recent Interactions */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">Saved Personal Demo Interactions</h3>
              <p className="text-xs text-slate-500">Your recent sessions with Swasth360 AI agents</p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {data.recentConversations.length} Saved
            </span>
          </div>

          {data.recentConversations.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No saved interactions yet. Launch any of the agents above to begin a session.
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentConversations.map(conv => (
                <div
                  key={conv.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900">{conv.title}</span>
                      <span className="text-[10px] text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200 font-semibold">
                        {conv.agentName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {new Date(conv.createdAt).toLocaleString()} • {conv.messageCount} messages
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const matched = data.availableAgents.find(a => a.id === conv.agentId);
                      if (matched) setActiveDemoAgent(matched);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-white text-xs font-semibold flex items-center space-x-1"
                  >
                    <span>Reopen</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Demo Modal */}
        {activeDemoAgent && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">
              <AgentDemoChat
                agent={activeDemoAgent}
                onClose={() => setActiveDemoAgent(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
