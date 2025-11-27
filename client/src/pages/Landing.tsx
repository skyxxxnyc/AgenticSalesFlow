import React from "react";
import { Zap, Target, Brain, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <header className="border-b-2 border-black px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">
            AutoSales<span className="text-primary">.ai</span>
          </h1>
          <a
            href="/api/login"
            className="bg-black text-white px-6 py-3 font-bold uppercase border-2 border-black neo-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
            data-testid="button-login"
          >
            Launch CRM
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 px-6 border-b-2 border-black">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block bg-secondary border-2 border-black px-3 py-1 mb-6 neo-shadow">
              <span className="font-mono font-bold uppercase text-sm">AI-POWERED SALES AUTOMATION</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
              Your Sales Team.<br />
              <span className="text-primary">Runs Itself.</span>
            </h2>
            <p className="text-xl font-bold max-w-2xl mx-auto mb-8 font-mono">
              Three autonomous AI agents find leads, craft outreach, and book meetings while you sleep.
            </p>
            <a
              href="/api/login"
              className="inline-block bg-primary text-white px-8 py-4 font-black uppercase text-lg border-2 border-black neo-shadow-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all"
              data-testid="button-get-started"
            >
              Get Started Free
            </a>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6 bg-muted border-b-2 border-black">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-4xl font-black uppercase text-center mb-12">Meet Your AI Workforce</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Hunter-01 */}
              <div className="bg-white border-2 border-black p-6 neo-shadow">
                <div className="w-16 h-16 bg-secondary border-2 border-black flex items-center justify-center mb-4">
                  <Target className="w-8 h-8" strokeWidth={3} />
                </div>
                <h4 className="text-2xl font-black uppercase mb-2">Hunter-01</h4>
                <p className="font-mono text-sm font-bold text-muted-foreground mb-4">Lead Generation SDR</p>
                <ul className="space-y-2 font-mono text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">▸</span> Scans 1000s of profiles daily
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">▸</span> ICP matching with 98% accuracy
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">▸</span> Verified emails & contacts
                  </li>
                </ul>
              </div>

              {/* Scribe-X */}
              <div className="bg-white border-2 border-black p-6 neo-shadow">
                <div className="w-16 h-16 bg-accent border-2 border-black flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
                <h4 className="text-2xl font-black uppercase mb-2">Scribe-X</h4>
                <p className="font-mono text-sm font-bold text-muted-foreground mb-4">Outreach Specialist</p>
                <ul className="space-y-2 font-mono text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">▸</span> Personalized multi-channel campaigns
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">▸</span> LinkedIn, Email, SMS, Phone
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">▸</span> Adaptive tone & timing
                  </li>
                </ul>
              </div>

              {/* Oracle */}
              <div className="bg-white border-2 border-black p-6 neo-shadow">
                <div className="w-16 h-16 bg-primary border-2 border-black flex items-center justify-center mb-4">
                  <Brain className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
                <h4 className="text-2xl font-black uppercase mb-2">Oracle</h4>
                <p className="font-mono text-sm font-bold text-muted-foreground mb-4">Pipeline Intelligence</p>
                <ul className="space-y-2 font-mono text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">▸</span> Detects buying signals in real-time
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">▸</span> Forecasts deal probability
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">▸</span> Suggests optimal next actions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-primary">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-5xl font-black uppercase mb-6 text-white">
              Stop Chasing.<br />Start Closing.
            </h3>
            <p className="text-lg font-bold mb-8 font-mono text-white/90">
              Join 1,000+ teams who've automated their sales pipeline.
            </p>
            <a
              href="/api/login"
              className="inline-block bg-white text-black px-8 py-4 font-black uppercase text-lg border-2 border-black neo-shadow-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all"
              data-testid="button-start-now"
            >
              Start Now - It's Free
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-black py-6 px-6">
        <div className="max-w-7xl mx-auto text-center font-mono text-sm font-bold text-muted-foreground">
          © 2026 AutoSales.AI - Autonomous CRM for Modern Teams
        </div>
      </footer>
    </div>
  );
}
