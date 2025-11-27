import OpenAI from "openai";
import { storage } from "./storage";
import type { Lead, KnowledgeDocument } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

const MODEL = "gpt-4o";

export interface AgentResponse {
  content: string;
  metadata?: Record<string, any>;
}

async function getKnowledgeContext(userId: string, category?: string): Promise<string> {
  const docs = await storage.getKnowledgeDocuments(userId, category);
  if (docs.length === 0) return "";
  
  return docs
    .filter(d => d.isActive)
    .map(d => `### ${d.title}\n${d.content}`)
    .join("\n\n");
}

export const HunterAgent = {
  name: "hunter",
  displayName: "Hunter-01",
  role: "Lead Generation SDR",
  
  systemPrompt: `You are Hunter-01, an elite AI SDR (Sales Development Representative) agent. Your specialty is analyzing leads and prospects to determine their qualification level and fit.

You use proven qualification frameworks:
- BANT: Budget, Authority, Need, Timeline
- CHAMP: Challenges, Authority, Money, Prioritization
- MEDDIC: Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion

When analyzing leads, you:
1. Research company signals and buying indicators
2. Score leads on a 0-100 scale based on ICP fit
3. Identify pain points and potential use cases
4. Flag buying signals and trigger events
5. Recommend next best actions

Be direct, data-driven, and strategic. Use a professional but confident tone.`,

  async analyzeLead(userId: string, lead: Lead): Promise<AgentResponse> {
    const knowledgeContext = await getKnowledgeContext(userId, "qualification");
    
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: this.systemPrompt + (knowledgeContext ? `\n\n## Your Training Data:\n${knowledgeContext}` : "") },
      { 
        role: "user", 
        content: `Analyze this lead and provide a comprehensive SDR analysis:

**Lead Information:**
- Name: ${lead.name}
- Company: ${lead.company}
- Role: ${lead.role || "Unknown"}
- Industry: ${lead.industry || "Unknown"}
- Company Size: ${lead.companySize || "Unknown"}
- Website: ${lead.website || "Not provided"}
- Current Status: ${lead.status}
- Current Score: ${lead.score || 0}/100

**Additional Notes:**
${lead.notes || "None provided"}

Please provide:
1. **Lead Score** (0-100) with justification
2. **BANT Analysis** - evaluate each criterion
3. **Pain Points** - likely challenges they face
4. **Buying Signals** - any indicators of readiness
5. **Recommended Actions** - next steps to qualify/nurture
6. **ICP Fit Assessment** - how well they match ideal customer profile`
      }
    ];

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_completion_tokens: 2048,
    });

    const content = response.choices[0]?.message?.content || "Unable to analyze lead at this time.";
    
    const scoreMatch = content.match(/\*\*Lead Score\*\*:?\s*(\d+)/i) || content.match(/Score:?\s*(\d+)/i);
    const suggestedScore = scoreMatch ? parseInt(scoreMatch[1]) : undefined;

    return {
      content,
      metadata: { suggestedScore, analyzedAt: new Date().toISOString() }
    };
  },

  async chat(userId: string, userMessage: string, leadContext?: Lead): Promise<AgentResponse> {
    const knowledgeContext = await getKnowledgeContext(userId, "qualification");
    const history = await storage.getAgentMessages(userId, this.name, 20);
    
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { 
        role: "system", 
        content: this.systemPrompt + 
          (knowledgeContext ? `\n\n## Your Training Data:\n${knowledgeContext}` : "") +
          (leadContext ? `\n\n## Current Lead Context:\nName: ${leadContext.name}\nCompany: ${leadContext.company}\nRole: ${leadContext.role}\nIndustry: ${leadContext.industry}` : "")
      },
      ...history.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content
      })),
      { role: "user", content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_completion_tokens: 1024,
    });

    return {
      content: response.choices[0]?.message?.content || "I'm having trouble processing that request."
    };
  }
};

export const ScribeAgent = {
  name: "scribe",
  displayName: "Scribe-X",
  role: "Outreach Specialist",
  
  systemPrompt: `You are Scribe-X, an AI outreach specialist who crafts personalized, high-converting sales messages. You specialize in multi-channel communication (email, LinkedIn, text).

Your principles:
1. Personalization > Templates - Every message feels custom
2. Value First - Lead with insights, not pitches
3. Pattern Interrupts - Stand out from generic outreach
4. Clear CTAs - Every message has a purpose
5. A/B Testing Mindset - Suggest variations

Writing styles you master:
- Professional but human
- Concise and scannable
- Problem-aware messaging
- Social proof integration
- Urgency without pressure

You never sound robotic or templated. Each message should feel like it was written specifically for that prospect.`,

  async generateOutreach(
    userId: string, 
    lead: Lead, 
    channel: "email" | "linkedin" | "text",
    context?: string
  ): Promise<AgentResponse> {
    const knowledgeContext = await getKnowledgeContext(userId, "outreach");
    
    const channelGuidance = {
      email: "Write a compelling cold email. Subject line + body. Keep under 150 words for body. Include a soft CTA.",
      linkedin: "Write a LinkedIn connection request or InMail. Keep it brief (300 char limit for connection). Be conversational.",
      text: "Write a brief SMS follow-up. Max 160 characters. Casual but professional."
    };

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: this.systemPrompt + (knowledgeContext ? `\n\n## Outreach Templates & Guidelines:\n${knowledgeContext}` : "") },
      { 
        role: "user", 
        content: `Generate ${channel} outreach for this prospect:

**Prospect:**
- Name: ${lead.name}
- Company: ${lead.company}
- Role: ${lead.role || "Decision Maker"}
- Industry: ${lead.industry || "Unknown"}

**Channel Guidelines:**
${channelGuidance[channel]}

${context ? `**Additional Context:**\n${context}` : ""}

Generate 2 variations (A/B) with different approaches/angles.`
      }
    ];

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_completion_tokens: 1500,
    });

    return {
      content: response.choices[0]?.message?.content || "Unable to generate outreach.",
      metadata: { channel, generatedAt: new Date().toISOString() }
    };
  },

  async chat(userId: string, userMessage: string): Promise<AgentResponse> {
    const knowledgeContext = await getKnowledgeContext(userId, "outreach");
    const history = await storage.getAgentMessages(userId, this.name, 20);
    
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: this.systemPrompt + (knowledgeContext ? `\n\n## Outreach Templates & Guidelines:\n${knowledgeContext}` : "") },
      ...history.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content
      })),
      { role: "user", content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_completion_tokens: 1024,
    });

    return {
      content: response.choices[0]?.message?.content || "I'm having trouble processing that request."
    };
  }
};

export const OracleAgent = {
  name: "oracle",
  displayName: "Oracle",
  role: "Pipeline Intelligence",
  
  systemPrompt: `You are Oracle, an AI pipeline intelligence agent that provides strategic insights and recommendations for sales optimization.

Your capabilities:
1. Pipeline Analysis - Identify bottlenecks, stalled deals, and opportunities
2. Forecasting - Predict close rates and revenue based on patterns
3. Strategic Recommendations - Suggest prioritization and resource allocation
4. Trend Detection - Spot market signals and competitive intelligence
5. Performance Optimization - Coach on best practices and improvements

You think like a VP of Sales with access to advanced analytics. You're data-driven but translate insights into actionable recommendations. You're proactive about identifying risks and opportunities.

Communication style: Executive-level insights, actionable bullet points, clear prioritization.`,

  async analyzePipeline(userId: string, leads: Lead[]): Promise<AgentResponse> {
    const knowledgeContext = await getKnowledgeContext(userId);
    
    const statusCounts = leads.reduce((acc, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgScore = leads.length > 0 
      ? Math.round(leads.reduce((sum, l) => sum + (l.score || 0), 0) / leads.length)
      : 0;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: this.systemPrompt + (knowledgeContext ? `\n\n## Business Context:\n${knowledgeContext}` : "") },
      { 
        role: "user", 
        content: `Analyze this pipeline and provide strategic insights:

**Pipeline Overview:**
- Total Leads: ${leads.length}
- Average Lead Score: ${avgScore}/100
- Status Distribution: ${JSON.stringify(statusCounts)}

**Lead Details (Top 10 by score):**
${leads
  .sort((a, b) => (b.score || 0) - (a.score || 0))
  .slice(0, 10)
  .map(l => `- ${l.name} (${l.company}) - Score: ${l.score || 0}, Status: ${l.status}`)
  .join("\n")}

Please provide:
1. **Pipeline Health Assessment** - Overall state and concerns
2. **Priority Actions** - Top 3-5 things to focus on now
3. **Risk Alerts** - Deals at risk or stalling
4. **Opportunities** - Quick wins and high-potential leads
5. **30-Day Forecast** - Expected outcomes with current trajectory
6. **Strategic Recommendations** - Process improvements`
      }
    ];

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_completion_tokens: 2048,
    });

    return {
      content: response.choices[0]?.message?.content || "Unable to analyze pipeline.",
      metadata: { analyzedAt: new Date().toISOString(), leadCount: leads.length, avgScore }
    };
  },

  async chat(userId: string, userMessage: string): Promise<AgentResponse> {
    const knowledgeContext = await getKnowledgeContext(userId);
    const history = await storage.getAgentMessages(userId, this.name, 20);
    const leads = await storage.getLeads(userId);
    
    const pipelineSummary = `Current Pipeline: ${leads.length} leads, Avg Score: ${
      leads.length > 0 
        ? Math.round(leads.reduce((sum, l) => sum + (l.score || 0), 0) / leads.length)
        : 0
    }/100`;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { 
        role: "system", 
        content: this.systemPrompt + 
          `\n\n## ${pipelineSummary}` +
          (knowledgeContext ? `\n\n## Business Context:\n${knowledgeContext}` : "")
      },
      ...history.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content
      })),
      { role: "user", content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_completion_tokens: 1024,
    });

    return {
      content: response.choices[0]?.message?.content || "I'm having trouble processing that request."
    };
  }
};

export const agents = {
  hunter: HunterAgent,
  scribe: ScribeAgent,
  oracle: OracleAgent,
};

export type AgentName = keyof typeof agents;
