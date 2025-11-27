import React, { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Terminal, Send, MessageSquare, BookOpen, Plus, Trash2, Power, Brain, Sparkles, TrendingUp, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { AgentMessage, KnowledgeDocument } from "@shared/schema";

import sdrAvatar from '@assets/generated_images/minimalist_geometric_avatar_for_an_ai_sdr_agent.png';
import outreachAvatar from '@assets/generated_images/minimalist_geometric_avatar_for_an_ai_outreach_agent.png';
import intelAvatar from '@assets/generated_images/minimalist_geometric_avatar_for_an_ai_intelligence_agent.png';

type AgentName = "hunter" | "scribe" | "oracle";

const agentInfo: Record<AgentName, { 
  name: string; 
  displayName: string; 
  role: string; 
  image: string; 
  color: string;
  bgColor: string;
  icon: React.ElementType;
  description: string;
}> = {
  hunter: { 
    name: "hunter",
    displayName: "Hunter-01", 
    role: "SDR / Lead Qualification", 
    image: sdrAvatar,
    color: "bg-secondary",
    bgColor: "bg-secondary/10",
    icon: Brain,
    description: "Analyzes leads using BANT/CHAMP frameworks. Scores prospects and identifies buying signals."
  },
  scribe: { 
    name: "scribe",
    displayName: "Scribe-X", 
    role: "Outreach Specialist", 
    image: outreachAvatar,
    color: "bg-accent",
    bgColor: "bg-accent/10",
    icon: Sparkles,
    description: "Crafts personalized cold emails, LinkedIn messages, and SMS outreach with A/B variations."
  },
  oracle: { 
    name: "oracle",
    displayName: "Oracle", 
    role: "Pipeline Intelligence", 
    image: intelAvatar,
    color: "bg-primary",
    bgColor: "bg-primary/10",
    icon: TrendingUp,
    description: "Provides strategic pipeline insights, forecasting, and optimization recommendations."
  }
};

const ChatMessage = ({ message, agentColor }: { message: AgentMessage; agentColor: string }) => (
  <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
    <div className={`w-8 h-8 rounded border-2 border-black flex items-center justify-center text-xs font-bold ${message.role === 'user' ? 'bg-gray-200' : agentColor}`}>
      {message.role === 'user' ? 'U' : 'AI'}
    </div>
    <div className={`flex-1 max-w-[85%] ${message.role === 'user' ? 'text-right' : ''}`}>
      <div className={`inline-block p-4 border-2 border-black neo-shadow text-sm whitespace-pre-wrap ${message.role === 'user' ? 'bg-gray-100 text-foreground' : 'bg-white text-foreground'}`}>
        {message.content}
      </div>
      <div className="text-xs font-mono text-muted-foreground mt-1">
        {new Date(message.createdAt!).toLocaleTimeString()}
      </div>
    </div>
  </div>
);

const AgentChat = ({ agentName }: { agentName: AgentName }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const agent = agentInfo[agentName];

  const { data: messages = [], isLoading } = useQuery<AgentMessage[]>({
    queryKey: [`/api/agents/${agentName}/messages`],
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', `/api/agents/${agentName}/chat`, { message });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/agents/${agentName}/messages`] });
      setInput("");
    },
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/agents/${agentName}/messages`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/agents/${agentName}/messages`] });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !chatMutation.isPending) {
      chatMutation.mutate(input.trim());
    }
  };

  return (
    <div className="flex flex-col h-full border-2 border-black neo-shadow bg-white">
      <div className={`${agent.color} border-b-2 border-black p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <img src={agent.image} alt={agent.displayName} className="w-10 h-10 border-2 border-black" />
          <div>
            <h3 className="font-black uppercase text-black">{agent.displayName}</h3>
            <p className="text-xs font-mono text-black/70">{agent.role}</p>
          </div>
        </div>
        <button
          onClick={() => clearMutation.mutate()}
          className="p-2 hover:bg-black/10 transition-colors"
          title="Clear chat"
          data-testid={`button-clear-chat-${agentName}`}
        >
          <Trash2 className="w-4 h-4 text-black" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse font-mono text-muted-foreground">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <agent.icon className={`w-12 h-12 mb-4 ${agent.color.replace('bg-', 'text-')}`} />
            <h4 className="font-bold text-lg mb-2 text-foreground">Chat with {agent.displayName}</h4>
            <p className="text-sm text-muted-foreground max-w-xs">{agent.description}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} agentColor={agent.color} />
          ))
        )}
        {chatMutation.isPending && (
          <div className="flex gap-3">
            <div className={`w-8 h-8 rounded border-2 border-black flex items-center justify-center text-xs font-bold ${agent.color}`}>AI</div>
            <div className="flex-1">
              <div className="inline-block p-4 border-2 border-black neo-shadow bg-white">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t-2 border-black bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${agent.displayName} anything...`}
            className="flex-1 px-4 py-3 border-2 border-black font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white text-foreground placeholder:text-muted-foreground"
            disabled={chatMutation.isPending}
            data-testid={`input-chat-${agentName}`}
          />
          <button
            type="submit"
            disabled={chatMutation.isPending || !input.trim()}
            className={`px-6 py-3 ${agent.color} border-2 border-black font-bold uppercase text-sm transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_0_black] disabled:opacity-50 disabled:cursor-not-allowed text-black`}
            data-testid={`button-send-${agentName}`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

const KnowledgeBase = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", category: "qualification", tags: "" });
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery<KnowledgeDocument[]>({
    queryKey: ['/api/knowledge'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('POST', '/api/knowledge', {
        ...data,
        tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/knowledge'] });
      setShowForm(false);
      setFormData({ title: "", content: "", category: "qualification", tags: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/knowledge/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/knowledge'] });
    },
  });

  const categoryColors: Record<string, string> = {
    qualification: "bg-secondary",
    outreach: "bg-accent",
    objection: "bg-primary",
    industry: "bg-purple-400",
    product: "bg-green-400",
  };

  return (
    <div className="border-2 border-black neo-shadow bg-white">
      <div className="bg-black text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5" />
          <h3 className="font-black uppercase">Knowledge Base</h3>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1 bg-white text-black border-2 border-white font-bold text-sm uppercase hover:bg-gray-100 transition-colors flex items-center gap-2"
          data-testid="button-add-knowledge"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Document"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate(formData);
          }}
          className="p-4 border-b-2 border-black bg-gray-50 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Document Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 border-2 border-black font-mono text-sm bg-white text-foreground placeholder:text-muted-foreground"
              required
              data-testid="input-knowledge-title"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-4 py-2 border-2 border-black font-mono text-sm bg-white text-foreground"
              data-testid="select-knowledge-category"
            >
              <option value="qualification">Qualification Criteria</option>
              <option value="outreach">Outreach Templates</option>
              <option value="objection">Objection Handling</option>
              <option value="industry">Industry Knowledge</option>
              <option value="product">Product Info</option>
            </select>
          </div>
          <textarea
            placeholder="Document content (training data, rubrics, templates...)"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-2 border-2 border-black font-mono text-sm min-h-[120px] bg-white text-foreground placeholder:text-muted-foreground"
            required
            data-testid="textarea-knowledge-content"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="flex-1 px-4 py-2 border-2 border-black font-mono text-sm bg-white text-foreground placeholder:text-muted-foreground"
              data-testid="input-knowledge-tags"
            />
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-2 bg-black text-white border-2 border-black font-bold uppercase hover:bg-gray-800 disabled:opacity-50"
              data-testid="button-save-knowledge"
            >
              {createMutation.isPending ? "Saving..." : "Save Document"}
            </button>
          </div>
        </form>
      )}

      <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-8 font-mono text-muted-foreground">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground font-mono text-sm">No knowledge documents yet.</p>
            <p className="text-muted-foreground/70 font-mono text-xs mt-1">Add training data, qualification rubrics, or outreach templates.</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="border-2 border-black p-4 hover:bg-gray-50 transition-colors group" data-testid={`card-knowledge-${doc.id}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border border-black ${categoryColors[doc.category] || 'bg-gray-200'} text-black`}>
                      {doc.category}
                    </span>
                    <h4 className="font-bold truncate text-foreground">{doc.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 font-mono">{doc.content}</p>
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {doc.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 border border-black/20 text-[10px] font-mono text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteMutation.mutate(doc.id)}
                  className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all"
                  title="Delete document"
                  data-testid={`button-delete-knowledge-${doc.id}`}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default function Agents() {
  const [selectedAgent, setSelectedAgent] = useState<AgentName>("hunter");
  const [activeTab, setActiveTab] = useState<"chat" | "knowledge">("chat");

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 text-foreground">Agent Command</h2>
          <p className="font-mono text-sm font-bold text-muted-foreground">Chat with your AI agents and manage their training data.</p>
        </div>

        <div className="flex gap-2 border-b-2 border-black pb-4">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-6 py-3 font-bold uppercase text-sm border-2 border-black transition-all flex items-center gap-2 ${
              activeTab === "chat" ? "bg-black text-white" : "bg-white text-foreground hover:bg-gray-100"
            }`}
            data-testid="tab-chat"
          >
            <MessageSquare className="w-4 h-4" /> Agent Chat
          </button>
          <button
            onClick={() => setActiveTab("knowledge")}
            className={`px-6 py-3 font-bold uppercase text-sm border-2 border-black transition-all flex items-center gap-2 ${
              activeTab === "knowledge" ? "bg-black text-white" : "bg-white text-foreground hover:bg-gray-100"
            }`}
            data-testid="tab-knowledge"
          >
            <BookOpen className="w-4 h-4" /> Knowledge Base
          </button>
        </div>

        {activeTab === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              {(Object.keys(agentInfo) as AgentName[]).map((key) => {
                const agent = agentInfo[key];
                const Icon = agent.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedAgent(key)}
                    className={`w-full p-4 border-2 border-black text-left transition-all ${
                      selectedAgent === key
                        ? `${agent.color} neo-shadow translate-x-[-2px] translate-y-[-2px]`
                        : "bg-white hover:bg-gray-50"
                    }`}
                    data-testid={`button-select-agent-${key}`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={agent.image} alt={agent.displayName} className="w-12 h-12 border-2 border-black" />
                      <div>
                        <h3 className={`font-black uppercase ${selectedAgent === key ? 'text-black' : 'text-foreground'}`}>{agent.displayName}</h3>
                        <p className={`text-xs font-mono ${selectedAgent === key ? 'text-black/70' : 'text-muted-foreground'}`}>{agent.role}</p>
                      </div>
                    </div>
                  </button>
                );
              })}

              <div className="mt-6 p-4 border-2 border-black bg-gray-50">
                <h4 className="font-bold uppercase text-sm mb-3 flex items-center gap-2 text-foreground">
                  <Terminal className="w-4 h-4" /> Quick Actions
                </h4>
                <div className="space-y-2">
                  <button
                    className="w-full px-3 py-2 text-left text-sm font-mono border-2 border-black bg-white text-foreground hover:bg-gray-100 transition-colors"
                    data-testid="button-quick-analyze"
                  >
                    Analyze All Leads
                  </button>
                  <button
                    className="w-full px-3 py-2 text-left text-sm font-mono border-2 border-black bg-white text-foreground hover:bg-gray-100 transition-colors"
                    data-testid="button-quick-pipeline"
                  >
                    Pipeline Report
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 h-[600px]">
              <AgentChat agentName={selectedAgent} />
            </div>
          </div>
        )}

        {activeTab === "knowledge" && (
          <KnowledgeBase />
        )}
      </div>
    </Layout>
  );
}
