import React from "react";
import Layout from "@/components/Layout";
import { Plus, MoreVertical, Calendar, BarChart3 } from "lucide-react";

const KanbanColumn = ({ title, color, count, children }: any) => (
  <div className="flex-1 min-w-[300px] flex flex-col">
    <div className={`p-3 border-2 border-black font-black uppercase tracking-tighter flex justify-between items-center ${color} mb-4 neo-shadow`}>
      <span>{title}</span>
      <span className="bg-black text-white w-6 h-6 flex items-center justify-center text-xs rounded-full">{count}</span>
    </div>
    <div className="space-y-4 flex-1 overflow-y-auto pb-10">
      {children}
    </div>
  </div>
);

const CampaignCard = ({ title, type, stats, tags }: any) => (
  <div className="bg-white border-2 border-black p-4 neo-shadow hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group">
    <div className="flex justify-between items-start mb-2">
      <span className="text-[10px] font-mono font-bold uppercase bg-gray-100 border border-black px-1">{type}</span>
      <MoreVertical className="w-4 h-4 opacity-0 group-hover:opacity-100" />
    </div>
    <h4 className="font-black uppercase text-lg leading-tight mb-3">{title}</h4>
    
    <div className="flex gap-2 mb-4 flex-wrap">
      {tags.map((tag: string) => (
        <span key={tag} className="text-[10px] font-bold font-mono text-muted-foreground">#{tag}</span>
      ))}
    </div>

    <div className="border-t-2 border-black/10 pt-3 flex justify-between items-center">
      <div className="flex items-center gap-1 text-xs font-bold font-mono">
        <BarChart3 className="w-3 h-3" /> {stats}
      </div>
      <div className="flex -space-x-2">
        <div className="w-6 h-6 rounded-full bg-secondary border border-black"></div>
        <div className="w-6 h-6 rounded-full bg-primary border border-black"></div>
      </div>
    </div>
  </div>
);

export default function Campaigns() {
  return (
    <Layout>
      <div className="h-[calc(100vh-140px)] flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8 shrink-0">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Active Campaigns</h2>
            <p className="font-mono text-sm font-bold text-muted-foreground">Orchestrated by Scribe-X</p>
          </div>
          <button className="bg-black text-white px-4 py-2 font-bold uppercase border-2 border-transparent hover:bg-primary hover:text-black hover:border-black transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Campaign
          </button>
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-6 h-full min-w-[1000px]">
            
            <KanbanColumn title="Drafting" color="bg-gray-200" count={2}>
              <CampaignCard 
                title="Q4 SaaS Outreach - Enterprise" 
                type="Email Sequence" 
                stats="Drafting..." 
                tags={["Enterprise", "SaaS", "Cold"]} 
              />
              <CampaignCard 
                title="LinkedIn Connection Request - CTOs" 
                type="LinkedIn" 
                stats="Drafting..." 
                tags={["Networking", "Tech"]} 
              />
            </KanbanColumn>

            <KanbanColumn title="Active / Running" color="bg-secondary" count={3}>
               <CampaignCard 
                title="Webinar Follow-up" 
                type="Multi-channel" 
                stats="45% Open Rate" 
                tags={["Warm", "Education"]} 
              />
               <CampaignCard 
                title="Series A Founders" 
                type="Email Sequence" 
                stats="12% Reply Rate" 
                tags={["Startup", "Funding"]} 
              />
               <CampaignCard 
                title="Retargeting - Pricing Page" 
                type="Ad Campaign" 
                stats="3.4 ROAS" 
                tags={["Ads", "Intent"]} 
              />
            </KanbanColumn>

            <KanbanColumn title="Completed" color="bg-primary" count={1}>
              <CampaignCard 
                title="Q3 Newsletter Blast" 
                type="Email Broadcast" 
                stats="1,200 Clicks" 
                tags={["Newsletter", "Q3"]} 
              />
            </KanbanColumn>
            
          </div>
        </div>
      </div>
    </Layout>
  );
}
