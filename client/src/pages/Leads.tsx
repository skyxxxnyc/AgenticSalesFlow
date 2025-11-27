import React from "react";
import Layout from "@/components/Layout";
import { Search, Filter, MoreHorizontal, Mail, Phone, Linkedin, MessageSquare } from "lucide-react";

const leadsData = [
  { id: 1, name: "Sarah Connor", company: "Skynet Systems", role: "CTO", status: "Hot Lead", score: 98, lastAction: "Email Opened" },
  { id: 2, name: "John Wick", company: "Continental Hotel", role: "Procurement", status: "Negotiation", score: 85, lastAction: "Meeting Booked" },
  { id: 3, name: "Ellen Ripley", company: "Weyland-Yutani", role: "Director of Ops", status: "New", score: 45, lastAction: "Linkedin View" },
  { id: 4, name: "Tony Stark", company: "Stark Industries", role: "CEO", status: "Contacted", score: 72, lastAction: "Reply Received" },
  { id: 5, name: "Bruce Wayne", company: "Wayne Ent.", role: "Owner", status: "Cold", score: 20, lastAction: "Bounced" },
];

export default function Leads() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Lead Pipeline</h2>
            <p className="font-mono text-sm font-bold text-muted-foreground">AI-Curated Opportunities</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search leads..." 
                className="w-full pl-10 pr-4 py-3 border-2 border-black font-mono text-sm bg-white neo-shadow focus:outline-none focus:ring-0"
              />
            </div>
            <button className="p-3 border-2 border-black bg-white neo-shadow hover:bg-accent hover:text-white transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="border-2 border-black bg-white neo-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white uppercase font-mono text-xs border-b-2 border-black">
                  <th className="p-4 font-bold tracking-wider">Lead Name</th>
                  <th className="p-4 font-bold tracking-wider">Company</th>
                  <th className="p-4 font-bold tracking-wider">AI Score</th>
                  <th className="p-4 font-bold tracking-wider">Status</th>
                  <th className="p-4 font-bold tracking-wider">Last Action</th>
                  <th className="p-4 font-bold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm">
                {leadsData.map((lead) => (
                  <tr key={lead.id} className="border-b border-black hover:bg-secondary/10 transition-colors group">
                    <td className="p-4 font-bold font-sans text-base flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 border border-black rounded-full overflow-hidden">
                         {/* Placeholder Avatar */}
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.name}`} alt={lead.name} />
                      </div>
                      {lead.name}
                    </td>
                    <td className="p-4">
                      <div className="font-bold">{lead.company}</div>
                      <div className="text-xs text-muted-foreground">{lead.role}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 flex-1 bg-gray-200 w-12 rounded-none border border-black overflow-hidden`}>
                          <div className={`h-full ${lead.score > 80 ? 'bg-green-500' : lead.score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${lead.score}%` }} />
                        </div>
                        <span className="font-bold">{lead.score}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`
                        px-2 py-1 text-xs font-black uppercase border border-black
                        ${lead.status === 'Hot Lead' ? 'bg-accent text-white' : 
                          lead.status === 'New' ? 'bg-secondary' : 
                          'bg-white'}
                      `}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground font-bold text-xs">
                      {lead.lastAction}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-black hover:text-white border border-transparent hover:border-black transition-colors" title="Email">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-black hover:text-white border border-transparent hover:border-black transition-colors" title="Call">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-black hover:text-white border border-transparent hover:border-black transition-colors" title="LinkedIn">
                          <Linkedin className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t-2 border-black bg-gray-50 flex justify-between items-center font-mono text-xs">
             <span className="font-bold">Showing 5 of 1,284 Leads</span>
             <div className="flex gap-2">
               <button className="px-3 py-1 border border-black bg-white hover:bg-black hover:text-white">Prev</button>
               <button className="px-3 py-1 border border-black bg-white hover:bg-black hover:text-white">Next</button>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
