import React from "react";
import { motion } from "framer-motion";

interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  color?: "primary" | "secondary" | "accent" | "white";
}

export default function MetricCard({ label, value, trend, trendUp, color = "white" }: MetricCardProps) {
  const bgColors = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-black",
    accent: "bg-accent text-white",
    white: "bg-white text-black",
  };

  return (
    <motion.div 
      whileHover={{ translate: "-4px -4px", boxShadow: "8px 8px 0px 0px black" }}
      className={`p-6 border-2 border-black neo-shadow ${bgColors[color]} relative overflow-hidden group`}
    >
      <div className="relative z-10">
        <div className="font-mono text-xs font-bold uppercase tracking-wider opacity-80 mb-2 border-b-2 border-black/20 pb-1 inline-block">
          {label}
        </div>
        <div className="text-4xl font-black tracking-tighter font-sans mt-2">
          {value}
        </div>
        {trend && (
          <div className={`mt-4 text-sm font-bold flex items-center gap-1 font-mono ${trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600'}`}>
            {trendUp ? "▲" : "▼"} {trend}
          </div>
        )}
      </div>
      
      {/* Background Pattern */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-black/5 rotate-45 transform group-hover:scale-150 transition-transform duration-500 ease-out" />
    </motion.div>
  );
}
