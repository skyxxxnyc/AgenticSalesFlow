import React from "react";
import Layout from "@/components/Layout";
import MetricCard from "@/components/MetricCard";
import AgentCard from "@/components/AgentCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Assets
import sdrAvatar from '@assets/generated_images/minimalist_geometric_avatar_for_an_ai_sdr_agent.png';
import outreachAvatar from '@assets/generated_images/minimalist_geometric_avatar_for_an_ai_outreach_agent.png';
import intelAvatar from '@assets/generated_images/minimalist_geometric_avatar_for_an_ai_intelligence_agent.png';

const data = [
  { name: 'Mon', leads: 40, response: 24 },
  { name: 'Tue', leads: 30, response: 13 },
  { name: 'Wed', leads: 20, response: 58 },
  { name: 'Thu', leads: 27, response: 39 },
  { name: 'Fri', leads: 18, response: 48 },
  { name: 'Sat', leads: 23, response: 38 },
  { name: 'Sun', leads: 34, response: 43 },
];

export default function Home() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b-2 border-black dark:border-white pb-6">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 text-black dark:text-white">Dashboard</h2>
            <p className="font-mono text-sm font-bold text-gray-600 dark:text-gray-300">System Status: <span className="text-green-600 dark:text-green-400">OPTIMAL</span></p>
          </div>
          <div className="flex gap-2">
             <button className="bg-primary text-white px-6 py-3 font-bold uppercase border-2 border-black dark:border-white neo-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform">
                + New Campaign
             </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard label="Total Leads Found" value="1,284" trend="12% vs last week" trendUp={true} color="white" />
          <MetricCard label="Outreach Sent" value="843" trend="5% vs last week" trendUp={true} color="secondary" />
          <MetricCard label="Meetings Booked" value="42" trend="3 New today" trendUp={true} color="primary" />
          <MetricCard label="Response Rate" value="18.4%" trend="2% decrease" trendUp={false} color="accent" />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border-2 border-black dark:border-white neo-shadow p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-black uppercase text-black dark:text-white">Pipeline Velocity</h3>
               <select className="border-2 border-black dark:border-white px-2 py-1 font-mono text-sm font-bold bg-transparent text-black dark:text-white">
                 <option>Last 7 Days</option>
                 <option>Last 30 Days</option>
               </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#000" opacity={0.1} />
                  <XAxis dataKey="name" tick={{fontFamily: 'JetBrains Mono', fontSize: 12}} stroke="#000" />
                  <YAxis tick={{fontFamily: 'JetBrains Mono', fontSize: 12}} stroke="#000" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #000', 
                      boxShadow: '4px 4px 0px 0px #000',
                      borderRadius: '0px',
                      fontFamily: 'JetBrains Mono'
                    }} 
                  />
                  <Area type="monotone" dataKey="leads" stackId="1" stroke="#000" fill="var(--secondary)" strokeWidth={3} />
                  <Area type="monotone" dataKey="response" stackId="1" stroke="#000" fill="var(--primary)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white dark:bg-slate-900 border-2 border-black dark:border-white neo-shadow p-0 flex flex-col">
             <div className="p-4 border-b-2 border-black dark:border-white bg-black text-white">
               <h3 className="text-lg font-black uppercase">Live Intelligence</h3>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[340px]">
               {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className="flex gap-3 items-start border-b border-dashed border-black/20 dark:border-white/20 pb-3 last:border-0">
                   <div className="w-2 h-2 bg-accent rounded-full mt-1.5 shrink-0" />
                   <div>
                     <p className="text-sm font-bold text-black dark:text-white">Buying Signal Detected</p>
                     <p className="text-xs font-mono text-gray-600 dark:text-gray-400 mt-1">TechStart Inc. just raised Series B funding.</p>
                     <span className="text-[10px] font-black bg-secondary text-black px-1 mt-2 inline-block border border-black">HIGH PRIORITY</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Agents Section */}
        <div>
          <h3 className="text-2xl font-black uppercase mb-6 text-black dark:text-white">Active Agents</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AgentCard 
              name="Hunter-01" 
              role="Lead Generation SDR" 
              status="active" 
              image={sdrAvatar}
              color="bg-secondary"
              metrics={[
                { label: "Leads Scraped", value: "1,240" },
                { label: "Verified Emails", value: "98%" },
                { label: "ICP Match", value: "High" }
              ]}
            />
            <AgentCard 
              name="Scribe-X" 
              role="Outreach Specialist" 
              status="active" 
              image={outreachAvatar}
              color="bg-accent"
              metrics={[
                { label: "Emails Sent", value: "843" },
                { label: "Open Rate", value: "62%" },
                { label: "Reply Rate", value: "12%" }
              ]}
            />
            <AgentCard 
              name="Oracle" 
              role="Pipeline Intelligence" 
              status="learning" 
              image={intelAvatar}
              color="bg-primary"
              metrics={[
                { label: "Signals Processed", value: "45k" },
                { label: "Forecast Acc.", value: "89%" },
                { label: "Next Action", value: "Optimizing" }
              ]}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
