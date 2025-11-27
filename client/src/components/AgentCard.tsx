import React from "react";
import { motion } from "framer-motion";
import { Activity, Power, Settings2 } from "lucide-react";

interface AgentCardProps {
  name: string;
  role: string;
  status: "active" | "idle" | "learning";
  image: string;
  metrics: { label: string; value: string }[];
  color: string;
}

export default function AgentCard({ name, role, status, image, metrics, color }: AgentCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-black neo-shadow flex flex-col h-full"
    >
      <div className={`h-32 border-b-2 border-black relative overflow-hidden ${color} p-4 flex items-end`}>
        <div className="absolute top-0 right-0 p-2">
          <div className="bg-black text-white text-xs font-mono px-2 py-1 font-bold uppercase flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
            {status}
          </div>
        </div>
        <img 
          src={image} 
          alt={name} 
          className="w-24 h-24 border-2 border-black bg-white absolute -bottom-12 left-6 object-cover neo-shadow"
        />
      </div>
      
      <div className="pt-14 px-6 pb-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-black uppercase leading-none">{name}</h3>
            <p className="text-sm font-mono text-muted-foreground font-bold mt-1">{role}</p>
          </div>
          <button className="p-2 hover:bg-black hover:text-white border-2 border-transparent hover:border-black transition-all rounded-none">
            <Settings2 className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mt-auto">
          {metrics.map((m, i) => (
            <div key={i} className="flex justify-between items-center border-b border-dashed border-black/20 pb-1">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase">{m.label}</span>
              <span className="text-sm font-bold">{m.value}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t-2 border-black flex gap-2">
          <button className="flex-1 bg-black text-white font-bold py-2 text-sm uppercase hover:bg-primary hover:text-black transition-colors border-2 border-black">
            Logs
          </button>
          <button className="flex-1 bg-white text-black font-bold py-2 text-sm uppercase hover:bg-accent hover:text-white transition-colors border-2 border-black">
            Tune
          </button>
        </div>
      </div>
    </motion.div>
  );
}
