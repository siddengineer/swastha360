import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Agent } from '../types';
import { AgentCard } from '../components/AgentCard';
import { AgentDemoChat } from '../components/AgentDemoChat';
import { Search, Sparkles, Filter, ShieldAlert, Bot } from 'lucide-react';

export const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'HOSPITAL' | 'INDIVIDUAL'>('ALL');
  const [activeDemoAgent, setActiveDemoAgent] = useState<Agent | null>(null);
  const [activeDetailsAgent, setActiveDetailsAgent] = useState<Agent | null>(null);

  useEffect(() => {
    api.agents.getAll()
      .then(data => {
        setAgents(data);
        setFilteredAgents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = agents;
    if (categoryFilter === 'HOSPITAL') {
      result = result.filter(a => a.isHospitalAgent);
    } else if (categoryFilter === 'INDIVIDUAL') {
      result = result.filter(a => a.isIndividualAgent);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(q) || 
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    }

    setFilteredAgents(result);
  }, [search, categoryFilter, agents]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>The 9 Specialized Healthcare AI Agents</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Explore Swasth360 AI Agents
          </h1>
          <p className="text-slate-600 text-base mt-3 leading-relaxed">
            All 9 specialized AI agents feature interactive demonstrations, evidence-backed educational responses, and deterministic safety guards.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by agent name, skill, or department..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                categoryFilter === 'ALL'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Agents (9)
            </button>
            <button
              onClick={() => setCategoryFilter('HOSPITAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                categoryFilter === 'HOSPITAL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Hospital B2B
            </button>
            <button
              onClick={() => setCategoryFilter('INDIVIDUAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                categoryFilter === 'INDIVIDUAL'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Individual B2C
            </button>
          </div>
        </div>

        {/* Agents Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <Bot className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No agents match your search</h3>
            <p className="text-slate-500 text-sm mt-1">Try resetting the filter or changing your search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onTryDemo={(a) => setActiveDemoAgent(a)}
                onViewDetails={(a) => setActiveDetailsAgent(a)}
              />
            ))}
          </div>
        )}

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

        {/* View Details Modal */}
        {activeDetailsAgent && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{activeDetailsAgent.name}</h3>
                    <span className="text-xs text-brand-600 font-semibold">{activeDetailsAgent.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveDetailsAgent(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-3 text-sm text-slate-600">
                <div>
                  <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-1">Purpose & Clinical Value</h4>
                  <p className="leading-relaxed">{activeDetailsAgent.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-1">Intended End-Users</h4>
                  <p>{activeDetailsAgent.intendedUsers}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-1">Platform Availability</h4>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">Current State: </span>
                    {activeDetailsAgent.defaultAvailability}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  onClick={() => setActiveDetailsAgent(null)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const ag = activeDetailsAgent;
                    setActiveDetailsAgent(null);
                    setActiveDemoAgent(ag);
                  }}
                  className="px-4 py-2 text-sm bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold flex items-center space-x-1"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Agent Demo</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
