import React, { useState } from "react";
import Layout from "@/components/Layout";
import LeadDetailsModal from "@/components/LeadDetailsModal";
import { Search, Filter, Mail, Phone, Linkedin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Lead } from "@shared/schema";

export default function Leads() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    },
  });

  const filteredLeads = leads.filter(
    (lead: Lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-black dark:border-white font-mono text-sm bg-white dark:bg-slate-900 neo-shadow focus:outline-none focus:ring-0"
                data-testid="input-search-leads"
              />
            </div>
            <button className="p-3 border-2 border-black dark:border-white bg-white dark:bg-slate-900 neo-shadow hover:bg-accent hover:text-white dark:hover:bg-accent transition-colors" data-testid="button-filter-leads">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="border-2 border-black dark:border-white bg-white dark:bg-slate-900 neo-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black dark:bg-slate-800 text-white uppercase font-mono text-xs border-b-2 border-black dark:border-white">
                  <th className="p-4 font-bold tracking-wider">Lead Name</th>
                  <th className="p-4 font-bold tracking-wider">Company</th>
                  <th className="p-4 font-bold tracking-wider">AI Score</th>
                  <th className="p-4 font-bold tracking-wider">Status</th>
                  <th className="p-4 font-bold tracking-wider">Last Action</th>
                  <th className="p-4 font-bold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-muted-foreground">Loading leads...</td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-muted-foreground">No leads found</td>
                  </tr>
                ) : (
                  filteredLeads.map((lead: Lead) => (
                    <tr 
                      key={lead.id} 
                      className="border-b border-black dark:border-white hover:bg-secondary/10 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                      data-testid={`row-lead-${lead.id}`}
                    >
                      <td className="p-4 font-bold font-sans text-base flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 border border-black dark:border-white rounded-full overflow-hidden">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.name}`} alt={lead.name} />
                        </div>
                        {lead.name}
                      </td>
                      <td className="p-4">
                        <div className="font-bold">{lead.company}</div>
                        <div className="text-xs text-muted-foreground">{lead.role || "Contact"}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 bg-gray-200 dark:bg-slate-700 w-12 rounded-none border border-black dark:border-white overflow-hidden">
                            <div 
                              className={`h-full ${(lead.score ?? 0) > 80 ? 'bg-green-500' : (lead.score ?? 0) > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                              style={{ width: `${lead.score ?? 0}%` }} 
                            />
                          </div>
                          <span className="font-bold">{lead.score ?? 0}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span 
                          className={`px-2 py-1 text-xs font-black uppercase border border-black dark:border-white ${
                            lead.status === 'hot' ? 'bg-accent text-white' : 
                            lead.status === 'new' ? 'bg-secondary dark:bg-slate-700' : 
                            'bg-white dark:bg-slate-800'
                          }`}
                          data-testid={`status-${lead.id}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground font-bold text-xs">
                        {lead.lastAction || "—"}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {lead.email && (
                            <a 
                              href={`mailto:${lead.email}`}
                              className="p-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-transparent hover:border-black dark:hover:border-white transition-colors"
                              title="Email"
                              onClick={(e) => e.stopPropagation()}
                              data-testid={`link-email-action-${lead.id}`}
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                          )}
                          {lead.phone && (
                            <a 
                              href={`tel:${lead.phone}`}
                              className="p-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-transparent hover:border-black dark:hover:border-white transition-colors"
                              title="Call"
                              onClick={(e) => e.stopPropagation()}
                              data-testid={`link-phone-action-${lead.id}`}
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                          {lead.linkedin && (
                            <a 
                              href={lead.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-transparent hover:border-black dark:hover:border-white transition-colors"
                              title="LinkedIn"
                              onClick={(e) => e.stopPropagation()}
                              data-testid={`link-linkedin-action-${lead.id}`}
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t-2 border-black dark:border-white bg-gray-50 dark:bg-slate-800 flex justify-between items-center font-mono text-xs">
            <span className="font-bold">Showing {filteredLeads.length} of {leads.length} Leads</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-black dark:border-white bg-white dark:bg-slate-900 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors" data-testid="button-prev-page">Prev</button>
              <button className="px-3 py-1 border border-black dark:border-white bg-white dark:bg-slate-900 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors" data-testid="button-next-page">Next</button>
            </div>
          </div>
        </div>
      </div>

      {selectedLead && (
        <LeadDetailsModal 
          lead={selectedLead} 
          isOpen={true} 
          onClose={() => setSelectedLead(null)} 
        />
      )}
    </Layout>
  );
}
