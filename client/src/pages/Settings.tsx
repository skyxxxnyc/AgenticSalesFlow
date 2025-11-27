import React from "react";
import Layout from "@/components/Layout";
import { Save } from "lucide-react";

const SettingSection = ({ title, children }: any) => (
  <div className="border-2 border-black bg-white p-6 neo-shadow mb-8">
    <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-black pb-2">{title}</h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const Toggle = ({ label, checked }: any) => (
  <div className="flex justify-between items-center">
    <label className="font-mono font-bold uppercase text-sm">{label}</label>
    <div className={`w-12 h-6 border-2 border-black rounded-full flex items-center px-1 cursor-pointer transition-colors ${checked ? 'bg-green-400' : 'bg-gray-200'}`}>
      <div className={`w-4 h-4 bg-black rounded-full transform transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
  </div>
);

const Input = ({ label, value, type = "text" }: any) => (
  <div className="space-y-1">
    <label className="font-mono font-bold uppercase text-xs text-muted-foreground">{label}</label>
    <input 
      type={type} 
      defaultValue={value} 
      className="w-full border-2 border-black p-2 font-mono text-sm font-bold focus:outline-none focus:bg-secondary/10 transition-colors"
    />
  </div>
);

export default function Settings() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
         <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">System Config</h2>
              <p className="font-mono text-sm font-bold text-muted-foreground">Global Parameters & API Keys</p>
            </div>
            <button className="bg-black text-white px-6 py-3 font-bold uppercase border-2 border-transparent hover:bg-primary hover:text-black hover:border-black transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
         </div>

         <SettingSection title="AI Model Configuration">
            <div className="grid grid-cols-2 gap-4">
               <Input label="OpenAI API Key" value="sk-........................" type="password" />
               <Input label="Anthropic API Key" value="sk-ant-...................." type="password" />
            </div>
            <Toggle label="Enable GPT-4 Turbo for Research" checked={true} />
            <Toggle label="Enable Claude 3 Opus for Copywriting" checked={true} />
         </SettingSection>

         <SettingSection title="Outreach Parameters">
            <div className="grid grid-cols-2 gap-4">
               <Input label="Max Emails / Day" value="500" />
               <Input label="Max LinkedIn Actions / Day" value="50" />
            </div>
            <Toggle label="Auto-pause on week-ends" checked={true} />
            <Toggle label="Respect Timezones" checked={true} />
         </SettingSection>
         
         <SettingSection title="Branding">
            <Input label="Company Name" value="Acme Corp" />
            <Input label="Value Proposition" value="We help SaaS companies scale their sales teams with AI." />
            <div className="pt-2">
              <label className="font-mono font-bold uppercase text-xs text-muted-foreground block mb-1">Tone of Voice</label>
              <div className="flex gap-2">
                {['Professional', 'Casual', 'Bold', 'Witty'].map(tone => (
                  <button key={tone} className={`px-3 py-1 border-2 border-black text-xs font-bold uppercase ${tone === 'Bold' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}>
                    {tone}
                  </button>
                ))}
              </div>
            </div>
         </SettingSection>
      </div>
    </Layout>
  );
}
