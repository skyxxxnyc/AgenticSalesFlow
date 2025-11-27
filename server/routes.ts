import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertLeadSchema, insertCampaignSchema, insertAgentConfigSchema, insertActivitySchema, insertTaskSchema, insertDealSchema, insertKnowledgeDocumentSchema, insertAgentMessageSchema } from "@shared/schema";
import { agents, type AgentName } from "./agents";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Auth middleware - from blueprint:javascript_log_in_with_replit
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Lead routes
  app.get("/api/leads", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userLeads = await storage.getLeads(userId);
      res.json(userLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.get("/api/leads/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const lead = await storage.getLead(req.params.id, userId);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      console.error("Error fetching lead:", error);
      res.status(500).json({ message: "Failed to fetch lead" });
    }
  });

  app.post("/api/leads", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const leadData = insertLeadSchema.parse({ ...req.body, userId });
      const lead = await storage.createLead(leadData);
      res.status(201).json(lead);
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(400).json({ message: "Failed to create lead" });
    }
  });

  app.patch("/api/leads/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const lead = await storage.updateLead(req.params.id, userId, req.body);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      console.error("Error updating lead:", error);
      res.status(500).json({ message: "Failed to update lead" });
    }
  });

  app.delete("/api/leads/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const deleted = await storage.deleteLead(req.params.id, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Lead not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting lead:", error);
      res.status(500).json({ message: "Failed to delete lead" });
    }
  });

  // Activity routes
  app.get("/api/leads/:leadId/activities", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const activities = await storage.getActivities(req.params.leadId, userId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.post("/api/leads/:leadId/activities", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const activityData = insertActivitySchema.parse({
        ...req.body,
        leadId: req.params.leadId,
        userId,
      });
      const activity = await storage.createActivity(activityData);
      res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(400).json({ message: "Failed to create activity" });
    }
  });

  // Task routes
  app.get("/api/leads/:leadId/tasks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tasks = await storage.getTasks(req.params.leadId, userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/leads/:leadId/tasks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const taskData = insertTaskSchema.parse({
        ...req.body,
        leadId: req.params.leadId,
        userId,
      });
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(400).json({ message: "Failed to create task" });
    }
  });

  app.patch("/api/leads/:leadId/tasks/:taskId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const task = await storage.updateTask(req.params.taskId, userId, req.body);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/leads/:leadId/tasks/:taskId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const deleted = await storage.deleteTask(req.params.taskId, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Deal routes
  app.get("/api/leads/:leadId/deals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const deals = await storage.getDeals(req.params.leadId, userId);
      res.json(deals);
    } catch (error) {
      console.error("Error fetching deals:", error);
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  app.post("/api/leads/:leadId/deals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const dealData = insertDealSchema.parse({
        ...req.body,
        leadId: req.params.leadId,
        userId,
      });
      const deal = await storage.createDeal(dealData);
      res.status(201).json(deal);
    } catch (error) {
      console.error("Error creating deal:", error);
      res.status(400).json({ message: "Failed to create deal" });
    }
  });

  app.patch("/api/leads/:leadId/deals/:dealId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const deal = await storage.updateDeal(req.params.dealId, userId, req.body);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      console.error("Error updating deal:", error);
      res.status(500).json({ message: "Failed to update deal" });
    }
  });

  // Campaign routes
  app.get("/api/campaigns", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userCampaigns = await storage.getCampaigns(userId);
      res.json(userCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.get("/api/campaigns/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const campaign = await storage.getCampaign(req.params.id, userId);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  app.post("/api/campaigns", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const campaignData = insertCampaignSchema.parse({ ...req.body, userId });
      const campaign = await storage.createCampaign(campaignData);
      res.status(201).json(campaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(400).json({ message: "Failed to create campaign" });
    }
  });

  app.patch("/api/campaigns/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const campaign = await storage.updateCampaign(req.params.id, userId, req.body);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      console.error("Error updating campaign:", error);
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  app.delete("/api/campaigns/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const deleted = await storage.deleteCampaign(req.params.id, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  });

  // Agent config routes
  app.get("/api/agents", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const configs = await storage.getAgentConfigs(userId);
      res.json(configs);
    } catch (error) {
      console.error("Error fetching agent configs:", error);
      res.status(500).json({ message: "Failed to fetch agent configs" });
    }
  });

  app.get("/api/agents/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const config = await storage.getAgentConfig(req.params.id, userId);
      if (!config) {
        return res.status(404).json({ message: "Agent config not found" });
      }
      res.json(config);
    } catch (error) {
      console.error("Error fetching agent config:", error);
      res.status(500).json({ message: "Failed to fetch agent config" });
    }
  });

  app.patch("/api/agents/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const config = await storage.upsertAgentConfig({ ...req.body, userId, id: req.params.id });
      res.json(config);
    } catch (error) {
      console.error("Error updating agent config:", error);
      res.status(500).json({ message: "Failed to update agent config" });
    }
  });

  // Knowledge base routes
  app.get("/api/knowledge", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const category = req.query.category as string | undefined;
      const docs = await storage.getKnowledgeDocuments(userId, category);
      res.json(docs);
    } catch (error) {
      console.error("Error fetching knowledge documents:", error);
      res.status(500).json({ message: "Failed to fetch knowledge documents" });
    }
  });

  app.get("/api/knowledge/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const doc = await storage.getKnowledgeDocument(req.params.id, userId);
      if (!doc) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(doc);
    } catch (error) {
      console.error("Error fetching knowledge document:", error);
      res.status(500).json({ message: "Failed to fetch knowledge document" });
    }
  });

  app.post("/api/knowledge", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const docData = insertKnowledgeDocumentSchema.parse({ ...req.body, userId });
      const doc = await storage.createKnowledgeDocument(docData);
      res.status(201).json(doc);
    } catch (error) {
      console.error("Error creating knowledge document:", error);
      res.status(400).json({ message: "Failed to create knowledge document" });
    }
  });

  app.patch("/api/knowledge/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const doc = await storage.updateKnowledgeDocument(req.params.id, userId, req.body);
      if (!doc) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(doc);
    } catch (error) {
      console.error("Error updating knowledge document:", error);
      res.status(500).json({ message: "Failed to update knowledge document" });
    }
  });

  app.delete("/api/knowledge/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const deleted = await storage.deleteKnowledgeDocument(req.params.id, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting knowledge document:", error);
      res.status(500).json({ message: "Failed to delete knowledge document" });
    }
  });

  // Agent chat routes
  app.get("/api/agents/:agentName/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const agentName = req.params.agentName;
      const messages = await storage.getAgentMessages(userId, agentName);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching agent messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/agents/:agentName/chat", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const agentName = req.params.agentName as AgentName;
      const { message, leadId } = req.body;

      if (!agents[agentName]) {
        return res.status(404).json({ message: "Agent not found" });
      }

      // Save user message
      await storage.createAgentMessage({
        userId,
        agentName,
        role: "user",
        content: message,
      });

      // Get lead context if provided
      let leadContext;
      if (leadId) {
        leadContext = await storage.getLead(leadId, userId);
      }

      // Get agent response
      const agent = agents[agentName];
      const response = await agent.chat(userId, message, leadContext);

      // Save assistant message
      const assistantMessage = await storage.createAgentMessage({
        userId,
        agentName,
        role: "assistant",
        content: response.content,
        metadata: response.metadata,
      });

      res.json(assistantMessage);
    } catch (error) {
      console.error("Error in agent chat:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.delete("/api/agents/:agentName/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const agentName = req.params.agentName;
      await storage.clearAgentMessages(userId, agentName);
      res.status(204).send();
    } catch (error) {
      console.error("Error clearing agent messages:", error);
      res.status(500).json({ message: "Failed to clear messages" });
    }
  });

  // Agent action routes
  app.post("/api/agents/hunter/analyze/:leadId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const lead = await storage.getLead(req.params.leadId, userId);
      
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      // Create action record
      const action = await storage.createAgentAction({
        userId,
        agentName: "hunter",
        actionType: "analyze_lead",
        targetId: lead.id,
        input: { leadId: lead.id },
        status: "running",
      });

      // Run analysis
      const response = await agents.hunter.analyzeLead(userId, lead);

      // Update lead with analysis
      await storage.updateLead(lead.id, userId, {
        sdrAnalysis: response.metadata,
        score: response.metadata?.suggestedScore || lead.score,
      });

      // Create activity record
      await storage.createActivity({
        leadId: lead.id,
        userId,
        type: "ai_analysis",
        title: "Hunter-01 SDR Analysis",
        description: "Lead analyzed by AI agent",
        metadata: response.metadata,
      });

      // Update action as completed
      await storage.updateAgentAction(action.id, {
        status: "completed",
        output: response,
        completedAt: new Date(),
      });

      res.json({ analysis: response.content, metadata: response.metadata });
    } catch (error) {
      console.error("Error in lead analysis:", error);
      res.status(500).json({ message: "Failed to analyze lead" });
    }
  });

  app.post("/api/agents/scribe/outreach/:leadId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { channel, context } = req.body;
      const lead = await storage.getLead(req.params.leadId, userId);
      
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      const response = await agents.scribe.generateOutreach(userId, lead, channel || "email", context);

      // Create activity record
      await storage.createActivity({
        leadId: lead.id,
        userId,
        type: "ai_outreach",
        title: `Scribe-X ${channel || "email"} Outreach`,
        description: "Outreach generated by AI agent",
        metadata: response.metadata,
      });

      res.json({ outreach: response.content, metadata: response.metadata });
    } catch (error) {
      console.error("Error generating outreach:", error);
      res.status(500).json({ message: "Failed to generate outreach" });
    }
  });

  app.post("/api/agents/oracle/analyze-pipeline", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const leads = await storage.getLeads(userId);
      
      const response = await agents.oracle.analyzePipeline(userId, leads);

      res.json({ analysis: response.content, metadata: response.metadata });
    } catch (error) {
      console.error("Error analyzing pipeline:", error);
      res.status(500).json({ message: "Failed to analyze pipeline" });
    }
  });

  return httpServer;
}
