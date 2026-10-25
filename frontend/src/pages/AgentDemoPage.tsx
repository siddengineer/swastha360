import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Agent } from '../types';
import { AgentDemoChat } from '../components/AgentDemoChat';
import { ArrowLeft, Bot, AlertCircle } from 'lucide-react';

export const AgentDemoPage: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) return;

    api.agents.getAll()
      .then(agents => {
        const found = agents.find(a => a.id === agentId);
        if (found) {
          setAgent(found);
        } else {
          setError(`Agent '${agentId}' not found.`);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load agent details');
        setLoading(false);
      });
  }, [agentId]);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading interactive demo...</div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Agent Not Found</h2>
          <p className="text-xs text-slate-600">{error || 'Unable to locate this agent.'}</p>
          <Link to="/agents" className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold">
            Return to Agents Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <Link to="/agents" className="inline-flex items-center space-x-1 hover:text-brand-600">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All AI Agents</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">{agent.name} Demo</span>
        </div>

        <AgentDemoChat agent={agent} />
      </div>
    </div>
  );
};
