import {
  users,
  leads,
  campaigns,
  agentConfigs,
  activities,
  tasks,
  deals,
  knowledgeDocuments,
  agentMessages,
  agentActions,
  type User,
  type UpsertUser,
  type Lead,
  type InsertLead,
  type Campaign,
  type InsertCampaign,
  type AgentConfig,
  type InsertAgentConfig,
  type Activity,
  type InsertActivity,
  type Task,
  type InsertTask,
  type Deal,
  type InsertDeal,
  type KnowledgeDocument,
  type InsertKnowledgeDocument,
  type AgentMessage,
  type InsertAgentMessage,
  type AgentAction,
  type InsertAgentAction,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations - REQUIRED for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Lead operations
  getLeads(userId: string): Promise<Lead[]>;
  getLead(id: string, userId: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, userId: string, data: Partial<InsertLead>): Promise<Lead | undefined>;
  deleteLead(id: string, userId: string): Promise<boolean>;
  
  // Campaign operations
  getCampaigns(userId: string): Promise<Campaign[]>;
  getCampaign(id: string, userId: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, userId: string, data: Partial<InsertCampaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: string, userId: string): Promise<boolean>;
  
  // Agent config operations
  getAgentConfigs(userId: string): Promise<AgentConfig[]>;
  getAgentConfig(id: string, userId: string): Promise<AgentConfig | undefined>;
  upsertAgentConfig(config: InsertAgentConfig): Promise<AgentConfig>;

  // Activity operations
  getActivities(leadId: string, userId: string): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Task operations
  getTasks(leadId: string, userId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, userId: string, data: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string, userId: string): Promise<boolean>;

  // Deal operations
  getDeals(leadId: string, userId: string): Promise<Deal[]>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDeal(id: string, userId: string, data: Partial<InsertDeal>): Promise<Deal | undefined>;

  // Knowledge document operations
  getKnowledgeDocuments(userId: string, category?: string): Promise<KnowledgeDocument[]>;
  getKnowledgeDocument(id: string, userId: string): Promise<KnowledgeDocument | undefined>;
  createKnowledgeDocument(doc: InsertKnowledgeDocument): Promise<KnowledgeDocument>;
  updateKnowledgeDocument(id: string, userId: string, data: Partial<InsertKnowledgeDocument>): Promise<KnowledgeDocument | undefined>;
  deleteKnowledgeDocument(id: string, userId: string): Promise<boolean>;

  // Agent message operations
  getAgentMessages(userId: string, agentName: string, limit?: number): Promise<AgentMessage[]>;
  createAgentMessage(message: InsertAgentMessage): Promise<AgentMessage>;
  clearAgentMessages(userId: string, agentName: string): Promise<boolean>;

  // Agent action operations
  getAgentActions(userId: string, agentName?: string): Promise<AgentAction[]>;
  createAgentAction(action: InsertAgentAction): Promise<AgentAction>;
  updateAgentAction(id: string, data: Partial<AgentAction>): Promise<AgentAction | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations - REQUIRED for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Lead operations
  async getLeads(userId: string): Promise<Lead[]> {
    return await db.select().from(leads).where(eq(leads.userId, userId));
  }

  async getLead(id: string, userId: string): Promise<Lead | undefined> {
    const [lead] = await db
      .select()
      .from(leads)
      .where(and(eq(leads.id, id), eq(leads.userId, userId)));
    return lead;
  }

  async createLead(leadData: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(leadData).returning();
    return lead;
  }

  async updateLead(id: string, userId: string, data: Partial<InsertLead>): Promise<Lead | undefined> {
    const [lead] = await db
      .update(leads)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(leads.id, id), eq(leads.userId, userId)))
      .returning();
    return lead;
  }

  async deleteLead(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(leads)
      .where(and(eq(leads.id, id), eq(leads.userId, userId)));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Campaign operations
  async getCampaigns(userId: string): Promise<Campaign[]> {
    return await db.select().from(campaigns).where(eq(campaigns.userId, userId));
  }

  async getCampaign(id: string, userId: string): Promise<Campaign | undefined> {
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(and(eq(campaigns.id, id), eq(campaigns.userId, userId)));
    return campaign;
  }

  async createCampaign(campaignData: InsertCampaign): Promise<Campaign> {
    const [campaign] = await db.insert(campaigns).values(campaignData).returning();
    return campaign;
  }

  async updateCampaign(id: string, userId: string, data: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const [campaign] = await db
      .update(campaigns)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(campaigns.id, id), eq(campaigns.userId, userId)))
      .returning();
    return campaign;
  }

  async deleteCampaign(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(campaigns)
      .where(and(eq(campaigns.id, id), eq(campaigns.userId, userId)));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Agent config operations
  async getAgentConfigs(userId: string): Promise<AgentConfig[]> {
    return await db.select().from(agentConfigs).where(eq(agentConfigs.userId, userId));
  }

  async getAgentConfig(id: string, userId: string): Promise<AgentConfig | undefined> {
    const [config] = await db
      .select()
      .from(agentConfigs)
      .where(and(eq(agentConfigs.id, id), eq(agentConfigs.userId, userId)));
    return config;
  }

  async upsertAgentConfig(configData: InsertAgentConfig): Promise<AgentConfig> {
    const [config] = await db
      .insert(agentConfigs)
      .values(configData)
      .onConflictDoUpdate({
        target: [agentConfigs.userId, agentConfigs.agentName],
        set: {
          ...configData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return config;
  }

  // Activity operations
  async getActivities(leadId: string, userId: string): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(and(eq(activities.leadId, leadId), eq(activities.userId, userId)))
      .orderBy(activities.createdAt);
  }

  async createActivity(activityData: InsertActivity): Promise<Activity> {
    const [activity] = await db.insert(activities).values(activityData).returning();
    return activity;
  }

  // Task operations
  async getTasks(leadId: string, userId: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.leadId, leadId), eq(tasks.userId, userId)))
      .orderBy(tasks.dueDate);
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(taskData).returning();
    return task;
  }

  async updateTask(id: string, userId: string, data: Partial<InsertTask>): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    return task;
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Deal operations
  async getDeals(leadId: string, userId: string): Promise<Deal[]> {
    return await db
      .select()
      .from(deals)
      .where(and(eq(deals.leadId, leadId), eq(deals.userId, userId)))
      .orderBy(deals.createdAt);
  }

  async createDeal(dealData: InsertDeal): Promise<Deal> {
    const [deal] = await db.insert(deals).values(dealData).returning();
    return deal;
  }

  async updateDeal(id: string, userId: string, data: Partial<InsertDeal>): Promise<Deal | undefined> {
    const [deal] = await db
      .update(deals)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(deals.id, id), eq(deals.userId, userId)))
      .returning();
    return deal;
  }

  // Knowledge document operations
  async getKnowledgeDocuments(userId: string, category?: string): Promise<KnowledgeDocument[]> {
    if (category) {
      return await db
        .select()
        .from(knowledgeDocuments)
        .where(and(eq(knowledgeDocuments.userId, userId), eq(knowledgeDocuments.category, category)))
        .orderBy(desc(knowledgeDocuments.createdAt));
    }
    return await db
      .select()
      .from(knowledgeDocuments)
      .where(eq(knowledgeDocuments.userId, userId))
      .orderBy(desc(knowledgeDocuments.createdAt));
  }

  async getKnowledgeDocument(id: string, userId: string): Promise<KnowledgeDocument | undefined> {
    const [doc] = await db
      .select()
      .from(knowledgeDocuments)
      .where(and(eq(knowledgeDocuments.id, id), eq(knowledgeDocuments.userId, userId)));
    return doc;
  }

  async createKnowledgeDocument(docData: InsertKnowledgeDocument): Promise<KnowledgeDocument> {
    const [doc] = await db.insert(knowledgeDocuments).values(docData).returning();
    return doc;
  }

  async updateKnowledgeDocument(id: string, userId: string, data: Partial<InsertKnowledgeDocument>): Promise<KnowledgeDocument | undefined> {
    const [doc] = await db
      .update(knowledgeDocuments)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(knowledgeDocuments.id, id), eq(knowledgeDocuments.userId, userId)))
      .returning();
    return doc;
  }

  async deleteKnowledgeDocument(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(knowledgeDocuments)
      .where(and(eq(knowledgeDocuments.id, id), eq(knowledgeDocuments.userId, userId)));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Agent message operations
  async getAgentMessages(userId: string, agentName: string, limit: number = 50): Promise<AgentMessage[]> {
    return await db
      .select()
      .from(agentMessages)
      .where(and(eq(agentMessages.userId, userId), eq(agentMessages.agentName, agentName)))
      .orderBy(agentMessages.createdAt)
      .limit(limit);
  }

  async createAgentMessage(messageData: InsertAgentMessage): Promise<AgentMessage> {
    const [message] = await db.insert(agentMessages).values(messageData).returning();
    return message;
  }

  async clearAgentMessages(userId: string, agentName: string): Promise<boolean> {
    const result = await db
      .delete(agentMessages)
      .where(and(eq(agentMessages.userId, userId), eq(agentMessages.agentName, agentName)));
    return result.rowCount !== null && result.rowCount >= 0;
  }

  // Agent action operations
  async getAgentActions(userId: string, agentName?: string): Promise<AgentAction[]> {
    if (agentName) {
      return await db
        .select()
        .from(agentActions)
        .where(and(eq(agentActions.userId, userId), eq(agentActions.agentName, agentName)))
        .orderBy(desc(agentActions.createdAt))
        .limit(100);
    }
    return await db
      .select()
      .from(agentActions)
      .where(eq(agentActions.userId, userId))
      .orderBy(desc(agentActions.createdAt))
      .limit(100);
  }

  async createAgentAction(actionData: InsertAgentAction): Promise<AgentAction> {
    const [action] = await db.insert(agentActions).values(actionData).returning();
    return action;
  }

  async updateAgentAction(id: string, data: Partial<AgentAction>): Promise<AgentAction | undefined> {
    const [action] = await db
      .update(agentActions)
      .set(data)
      .where(eq(agentActions.id, id))
      .returning();
    return action;
  }
}

export const storage = new DatabaseStorage();
