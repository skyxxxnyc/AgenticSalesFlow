import React, { useState } from "react";
import { X, Mail, Phone, Linkedin, Globe, Building2, Briefcase, MessageSquare, CheckCircle2, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Lead, Activity, Task, Deal } from "@shared/schema";

interface LeadDetailsModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadDetailsModal({ lead, isOpen, onClose }: LeadDetailsModalProps) {
  const queryClient = useQueryClient();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "analysis" | "activity" | "tasks" | "deals">("overview");

  // Fetch related data
  const { data: activities = [] } = useQuery({
    queryKey: ["activities", lead.id],
    queryFn: async () => {
      const res = await fetch(`/api/leads/${lead.id}/activities`);
      if (!res.ok) throw new Error("Failed to fetch activities");
      return res.json();
    },
    enabled: isOpen,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", lead.id],
    queryFn: async () => {
      const res = await fetch(`/api/leads/${lead.id}/tasks`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return res.json();
    },
    enabled: isOpen,
  });

  const { data: deals = [] } = useQuery({
    queryKey: ["deals", lead.id],
    queryFn: async () => {
      const res = await fetch(`/api/leads/${lead.id}/deals`);
      if (!res.ok) throw new Error("Failed to fetch deals");
      return res.json();
    },
    enabled: isOpen,
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch(`/api/leads/${lead.id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: "" }),
      });
      if (!res.ok) throw new Error("Failed to create task");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", lead.id] });
      setNewTaskTitle("");
    },
  });

  // Update task completion
  const updateTaskMutation = useMutation({
    mutationFn: async (payload: { taskId: string; completed: boolean }) => {
      const res = await fetch(`/api/leads/${lead.id}/tasks/${payload.taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: payload.completed }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", lead.id] });
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" data-testid="modal-lead-details">
      <div className="bg-white dark:bg-slate-900 border-2 border-black dark:border-white w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col neo-shadow">
        {/* Header */}
        <div className="bg-black dark:bg-slate-900 text-white p-6 border-b-2 border-black dark:border-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary border-2 border-white rounded-none flex items-center justify-center font-bold">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.name}`} alt={lead.name} className="w-full h-full" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase">{lead.name}</h2>
              <p className="font-mono text-sm">{lead.role} at {lead.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:text-black transition-colors"
            data-testid="button-close-modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b-2 border-black dark:border-white flex bg-gray-50 dark:bg-slate-800 text-black dark:text-white">
          {(["overview", "analysis", "activity", "tasks", "deals"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 font-mono font-bold uppercase text-xs border-r border-black dark:border-white last:border-r-0 transition-colors ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
              data-testid={`tab-${tab}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="p-6 space-y-6 text-black dark:text-white">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-mono font-bold text-xs uppercase mb-3">Contact Details</h3>
                  <div className="space-y-3">
                    {lead.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${lead.email}`} className="font-mono text-sm hover:text-accent underline" data-testid="text-email">
                          {lead.email}
                        </a>
                      </div>
                    )}
                    {lead.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${lead.phone}`} className="font-mono text-sm hover:text-accent underline" data-testid="text-phone">
                          {lead.phone}
                        </a>
                      </div>
                    )}
                    {lead.linkedin && (
                      <div className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4" />
                        <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="font-mono text-sm hover:text-accent underline" data-testid="link-linkedin">
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-mono font-bold text-xs uppercase mb-3">Company Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span className="font-mono text-sm" data-testid="text-company">{lead.company}</span>
                    </div>
                    {lead.companySize && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span className="font-mono text-sm" data-testid="text-company-size">{lead.companySize}</span>
                      </div>
                    )}
                    {lead.industry && (
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-mono text-sm" data-testid="text-industry">{lead.industry}</span>
                      </div>
                    )}
                    {lead.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <a href={lead.website} target="_blank" rel="noopener noreferrer" className="font-mono text-sm hover:text-accent underline" data-testid="link-website">
                          Visit Site
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {lead.notes && (
                <div className="border-t-2 border-black dark:border-white pt-6">
                  <h3 className="font-mono font-bold text-xs uppercase mb-3">Notes</h3>
                  <p className="font-mono text-sm whitespace-pre-wrap" data-testid="text-notes">{lead.notes}</p>
                </div>
              )}

              <div className="border-t-2 border-black dark:border-white pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono font-bold text-xs uppercase">Lead Score</h3>
                  <span className="font-mono font-bold text-lg" data-testid="text-score">{lead.score}/100</span>
                </div>
                <div className="mt-3 h-3 bg-gray-200 dark:bg-slate-700 rounded-none border-2 border-black dark:border-white overflow-hidden">
                  <div 
                    className={`h-full ${(lead.score ?? 0) > 80 ? 'bg-green-500' : (lead.score ?? 0) > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${lead.score ?? 0}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Analysis Tab */}
          {activeTab === "analysis" && (
            <div className="p-6 text-black dark:text-white">
              {lead.sdrAnalysis ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-slate-800 p-4 border-2 border-black dark:border-white rounded-none">
                    <h3 className="font-mono font-bold text-xs uppercase mb-3 text-black dark:text-white">SDR Analysis</h3>
                    <pre className="font-mono text-sm whitespace-pre-wrap text-black dark:text-white" data-testid="text-sdr-analysis">
                      {JSON.stringify(lead.sdrAnalysis, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground font-mono">No SDR analysis available yet. Hunter-01 will analyze this lead soon.</p>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <div className="p-6 text-black dark:text-white">
              {activities.length === 0 ? (
                <p className="text-muted-foreground font-mono">No activities recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity: Activity) => (
                    <div key={activity.id} className="border-l-4 border-accent pl-4 py-2 text-black dark:text-white" data-testid={`activity-item-${activity.id}`}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-mono font-bold text-sm uppercase text-black dark:text-white">{activity.title}</h4>
                        <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-mono text-sm text-gray-600 dark:text-gray-400 mt-1">{activity.type}</p>
                      {activity.description && (
                        <p className="font-mono text-sm text-black dark:text-white mt-2">{activity.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === "tasks" && (
            <div className="p-6 text-black dark:text-white">
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a new task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newTaskTitle.trim()) {
                        createTaskMutation.mutate(newTaskTitle);
                      }
                    }}
                    className="flex-1 px-3 py-2 border-2 border-black dark:border-white font-mono text-sm bg-white dark:bg-slate-800 text-black dark:text-white"
                    data-testid="input-new-task"
                  />
                  <button
                    onClick={() => newTaskTitle.trim() && createTaskMutation.mutate(newTaskTitle)}
                    className="px-4 py-2 bg-primary text-white border-2 border-black dark:border-white font-mono font-bold text-sm hover:opacity-90"
                    data-testid="button-add-task"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {tasks.length === 0 ? (
                <p className="text-muted-foreground font-mono">No tasks yet.</p>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task: Task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 border-2 border-black dark:border-white hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors text-black dark:text-white"
                      onClick={() => updateTaskMutation.mutate({ taskId: task.id, completed: !task.completed })}
                      data-testid={`task-item-${task.id}`}
                    >
                      <button
                        className={`flex-shrink-0 w-5 h-5 border-2 border-black dark:border-white flex items-center justify-center ${
                          task.completed ? 'bg-green-500 border-green-500' : ''
                        }`}
                        data-testid={`checkbox-task-${task.id}`}
                      >
                        {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>
                      <div className="flex-1">
                        <p className={`font-mono text-sm ${task.completed ? 'line-through text-gray-600 dark:text-gray-400' : 'text-black dark:text-white'}`}>
                          {task.title}
                        </p>
                      </div>
                      {task.dueDate && (
                        <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                          {new Date(task.dueDate as string).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Deals Tab */}
          {activeTab === "deals" && (
            <div className="p-6 text-black dark:text-white">
              {deals.length === 0 ? (
                <p className="text-muted-foreground font-mono">No deals linked to this lead yet.</p>
              ) : (
                <div className="space-y-4">
                  {deals.map((deal: Deal) => (
                    <div key={deal.id} className="border-2 border-black dark:border-white p-4 text-black dark:text-white" data-testid={`deal-item-${deal.id}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-mono font-bold uppercase text-black dark:text-white">{deal.title}</h4>
                        <span className="font-mono text-xs px-2 py-1 bg-primary text-white border-1 border-black">
                          {deal.status}
                        </span>
                      </div>
                      {deal.description && (
                        <p className="font-mono text-sm text-gray-600 dark:text-gray-400 mb-2">{deal.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        {deal.value && (
                          <span className="font-mono font-bold text-sm text-black dark:text-white">${deal.value.toLocaleString()}</span>
                        )}
                        {deal.expectedCloseDate && (
                          <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                            Close: {new Date(deal.expectedCloseDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
