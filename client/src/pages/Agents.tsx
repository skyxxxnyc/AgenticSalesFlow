import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Terminal, Activity, Power, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

// Assets
import sdrAvatar from '@assets/generated_images/minimalist_geometric_avatar_for_an_ai_sdr_agent.png';
import outreachAvatar from '@assets/generated_images/minimalist_geometric_avatar_for_an_ai_outreach_agent.png';
import intelAvatar from '@assets/generated_images/minimalist_geometric_avatar_for_an_ai_intelligence_agent.png';

const AgentTerminal = ({ name, logs, color }: { name: string, logs: string[], color: string }) => (
  <div className="flex flex-col h-full border-2 border-black neo-shadow bg-black text-green-400 font-mono text-xs p-4 relative overflow-hidden">
    <div className={`absolute top-0 left-0 right-0 h-8 ${color} border-b-2 border-black flex items-center px-3 justify-between text-black font-bold uppercase`}>
      <span className="flex items-center gap-2"><Terminal className="w-4 h-4" /> {name}_KERNEL_V2.4</span>
      <div className="flex gap-1">
        <div className="w-3 h-3 rounded-full bg-black/20 border border-black"></div>
        <div className="w-3 h-3 rounded-full bg-black/20 border border-black"></div>
      </div>
    </div>
    <div className="mt-8 space-y-2 overflow-y-auto flex-1 opacity-80">
      {logs.map((log, i) => (
        <div key={i} className="border-l-2 border-green-500/30 pl-2">
          <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span> {log}
        </div>
      ))}
      <div className="animate-pulse">_</div>
    </div>
  </div>
);

const AgentConfig = ({ name, role, image, status, color }: any) => (
  <div className="bg-white border-2 border-black neo-shadow p-6">
    <div className="flex items-start gap-4 border-b-2 border-black pb-6 mb-6">
      <img src={image} alt={name} className="w-20 h-20 border-2 border-black bg-gray-100 object-cover" />
      <div className="flex-1">
        <div className="flex justify-between items-start">
           <h3 className="text-2xl font-black uppercase">{name}</h3>
           <div className={`px-2 py-1 text-xs font-bold uppercase border border-black flex items-center gap-2 ${status === 'active' ? 'bg-green-400' : 'bg-yellow-400'}`}>
             <Power className="w-3 h-3" /> {status}
           </div>
        </div>
        <p className="font-mono text-sm font-bold text-muted-foreground mt-1">{role}</p>
        
        <div className="mt-3 flex gap-2">
          <div className="px-2 py-1 bg-gray-100 border border-black text-[10px] font-mono uppercase font-bold">GPT-4o</div>
          <div className="px-2 py-1 bg-gray-100 border border-black text-[10px] font-mono uppercase font-bold">Memory: 128GB</div>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="font-bold font-mono uppercase text-sm">Autonomous Mode</label>
        <div className={`w-12 h-6 border-2 border-black rounded-full flex items-center px-1 cursor-pointer transition-colors ${status === 'active' ? color : 'bg-gray-200'}`}>
          <div className={`w-4 h-4 bg-black rounded-full transform transition-transform ${status === 'active' ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <label className="font-bold font-mono uppercase text-sm">Aggression Level</label>
        <input type="range" className="w-32 accent-black" />
      </div>
      <div className="flex justify-between items-center">
        <label className="font-bold font-mono uppercase text-sm">Budget / Day</label>
        <span className="font-mono font-bold border-b border-black">$50.00</span>
      </div>
    </div>
  </div>
);

export default function Agents() {
  const [logs, setLogs] = useState<string[]>(["System initialized...", "Connecting to neural net...", "Syncing databases..."]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLogs = [
        "Scanning LinkedIn for 'CTO' in 'SaaS'",
        "Found 3 new matches",
        "Analyzing sentiment: POSITIVE",
        "Drafting outreach sequence #42",
        "Optimizing send times...",
        "Ping received from CRM"
      ];
      const randomLog = newLogs[Math.floor(Math.random() * newLogs.length)];
      setLogs(prev => [...prev.slice(-8), randomLog]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Agent Command</h2>
          <p className="font-mono text-sm font-bold text-muted-foreground">Manage your autonomous workforce.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
          {/* Agent 1 Column */}
          <div className="space-y-6 flex flex-col h-full">
             <AgentConfig 
               name="Hunter-01" 
               role="SDR / Research" 
               image={sdrAvatar} 
               status="active"
               color="bg-secondary"
             />
             <div className="flex-1">
               <AgentTerminal name="HUNTER" logs={logs} color="bg-secondary" />
             </div>
          </div>

          {/* Agent 2 Column */}
          <div className="space-y-6 flex flex-col h-full">
             <AgentConfig 
               name="Scribe-X" 
               role="Outreach / Copy" 
               image={outreachAvatar} 
               status="active"
               color="bg-accent"
             />
             <div className="flex-1">
               <AgentTerminal name="SCRIBE" logs={logs.map(l => `Gen: ${l}`)} color="bg-accent" />
             </div>
          </div>

          {/* Agent 3 Column */}
          <div className="space-y-6 flex flex-col h-full">
             <AgentConfig 
               name="Oracle" 
               role="Intelligence / Strat" 
               image={intelAvatar} 
               status="learning"
               color="bg-primary"
             />
             <div className="flex-1">
               <AgentTerminal name="ORACLE" logs={logs.map(l => `Analysing: ${l}`)} color="bg-primary" />
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
