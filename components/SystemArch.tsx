
import React from 'react';

const SystemArch: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-white">System Architecture</h2>
        <p className="text-gray-400">The Personal Career Navigator is designed as an agentic multi-stage pipeline, utilizing Gemini's reasoning capabilities combined with real-time web search.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="glass p-6 rounded-2xl space-y-3">
            <h3 className="font-bold text-blue-400">1. Profile Analyzer Agent</h3>
            <p className="text-sm text-gray-400">Uses <code className="text-xs bg-white/10 px-1 py-0.5 rounded">gemini-3-flash-preview</code> with a strict JSON schema to parse unstructured text into a canonical <code className="text-xs text-gray-300">Profile</code> object.</p>
          </div>
          <div className="glass p-6 rounded-2xl space-y-3">
            <h3 className="font-bold text-emerald-400">2. Market Alignment Agent</h3>
            <p className="text-sm text-gray-400">Utilizes <code className="text-xs bg-white/10 px-1 py-0.5 rounded">googleSearch</code> tools to find live salary, skill frequency, and job description data from LinkedIn/Glassdoor (simulated via search).</p>
          </div>
          <div className="glass p-6 rounded-2xl space-y-3">
            <h3 className="font-bold text-amber-400">3. Gap Architect Agent</h3>
            <p className="text-sm text-gray-400">Performs high-dimensional mapping between the extracted user profile and the market requirements to generate a weighted gap matrix.</p>
          </div>
          <div className="glass p-6 rounded-2xl space-y-3">
            <h3 className="font-bold text-purple-400">4. Plan Strategist Agent</h3>
            <p className="text-sm text-gray-400">Constructs a 30-day temporal dependency graph (Roadmap) ensuring that day N skills are prerequisites for day N+k tasks.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold">Tech Stack</h3>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['React 18', 'TypeScript', 'Tailwind CSS', 'Gemini API', 'Recharts', 'Google Search Tool', 'Agentic Workflows', 'Structured JSON'].map(item => (
            <li key={item} className="glass py-2 px-4 rounded-lg text-xs font-mono text-center">{item}</li>
          ))}
        </ul>
      </section>

      <section className="glass p-8 rounded-3xl space-y-4 bg-gradient-to-r from-blue-900/10 to-transparent border-blue-500/20">
        <h3 className="text-xl font-bold">Agentic Reasoning Loop</h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          Unlike static career maps, the <strong>Navigator</strong> uses a feedback loop. Every time a "Checkpoint" is reached (in a production version), 
          the agent re-evaluates the roadmap based on performance. If a user struggles with "Day 5: System Architecture", 
          the <strong>Plan Strategist</strong> would automatically re-generate days 6-30 to focus on fundamentals before moving to implementation.
        </p>
      </section>
    </div>
  );
};

export default SystemArch;
