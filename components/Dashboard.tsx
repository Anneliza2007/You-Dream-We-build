
import React, { useState, useMemo } from 'react';
import { Profile, CareerPlan, Resource } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  profile: Profile;
  plan: CareerPlan;
  quote?: string;
}

const ResourceSection: React.FC<{ title: string; resources: Resource[]; color: string; icon: React.ReactNode }> = ({ title, resources, color, icon }) => {
  if (!resources || resources.length === 0) return null;
  return (
    <div className="mt-4 space-y-2">
      <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${color}`}>
        {icon}
        {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {resources.map((res, i) => (
          <a
            key={i}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col glass border border-white/5 p-2 rounded-lg hover:bg-white/10 transition-all max-w-[200px]"
          >
            <span className="text-xs font-semibold text-white truncate">{res.title}</span>
            {res.description && <span className="text-[10px] text-gray-400 line-clamp-1">{res.description}</span>}
          </a>
        ))}
      </div>
    </div>
  );
};

const Dashboard: React.FC<Props> = ({ profile, plan, quote }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'gaps' | 'market' | 'future'>(plan.under18Result ? 'future' : 'roadmap');
  const [isSelfPaced, setIsSelfPaced] = useState(false);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

  const toggleTask = (day: number) => {
    const next = new Set(completedDays);
    if (next.has(day)) {
      next.delete(day);
    } else {
      next.add(day);
    }
    setCompletedDays(next);
  };

  if (plan.under18Result) {
    const res = plan.under18Result;
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="glass p-8 rounded-3xl border-l-4 border-emerald-500 bg-gradient-to-r from-emerald-600/5 to-transparent">
          <h2 className="text-3xl font-extrabold text-white mb-2">Hello, {profile.name}!</h2>
          <p className="text-gray-400 text-lg">Since you're {profile.age}, we've mapped out some paths you can start exploring today.</p>
        </div>

        {quote && (
          <div className="w-full text-center py-6 px-4 quote-highlight mb-4">
            <p className="quote-font font-black italic text-3xl text-blue-400 drop-shadow-lg">
              &ldquo;{quote}&rdquo;
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {res.recommendedPaths.map((path, i) => (
            <div key={i} className="glass p-6 rounded-2xl border border-white/5 space-y-4 hover:border-emerald-500/50 transition-all">
              <div className="h-12 w-12 bg-emerald-600/20 rounded-xl flex items-center justify-center text-emerald-500 font-bold">0{i+1}</div>
              <h3 className="text-xl font-bold text-white">{path.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{path.description}</p>
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Why it fits you</p>
                <p className="text-xs text-gray-300 italic">"{path.why}"</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Start these now</p>
                <div className="flex flex-wrap gap-2">
                  {path.skillsToStartNow.map((skill, si) => (
                    <span key={si} className="text-[10px] bg-white/5 px-2 py-1 rounded-full text-gray-300">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass p-8 rounded-3xl space-y-4">
          <h3 className="text-xl font-bold text-white">General Guidance for Success</h3>
          <p className="text-gray-400 leading-relaxed whitespace-pre-line">{res.generalAdvice}</p>
        </div>
      </div>
    );
  }

  // Dynamic Chart Data based on completion
  const chartData = useMemo(() => {
    const totalTasks = plan.roadmap.length || 1;
    const globalCompletionRatio = completedDays.size / totalTasks;

    return plan.gaps.map(g => {
      const baseCurrent = 10 - g.importance;
      // Heuristic: Skill mastery increases as tasks are checked off. 
      // If a task mentions the skill name, it has a higher weight for that specific gap.
      let specificMatches = 0;
      let specificCompleted = 0;
      
      plan.roadmap.forEach(task => {
        const mentionsSkill = task.title.toLowerCase().includes(g.skill.toLowerCase()) || 
                             task.description.toLowerCase().includes(g.skill.toLowerCase());
        if (mentionsSkill) {
          specificMatches++;
          if (completedDays.has(task.day)) {
            specificCompleted++;
          }
        }
      });

      const skillProgress = specificMatches > 0 
        ? specificCompleted / specificMatches 
        : globalCompletionRatio;

      const currentVal = baseCurrent + (g.importance * skillProgress);

      return {
        subject: g.skill,
        A: parseFloat(currentVal.toFixed(1)),
        B: 10,
        fullMark: 10,
      };
    }).slice(0, 6);
  }, [plan.gaps, plan.roadmap, completedDays]);

  const completionPercentage = Math.round((completedDays.size / (plan.roadmap.length || 1)) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Navigator Dashboard: {profile.name}</h2>
          <p className="text-gray-400">Personalized roadmap to becoming a {plan.dreamRole}.</p>
        </div>
        {quote && (
          <div className="md:max-w-md quote-highlight px-8 py-3 rounded-xl">
             <p className="quote-font font-black italic text-xl text-blue-400 text-center drop-shadow-md">
              &ldquo;{quote}&rdquo;
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl border-l-4 border-blue-500">
          <p className="text-xs uppercase font-bold text-gray-500 mb-1">Target Role</p>
          <h3 className="text-xl font-bold text-white">{plan.dreamRole}</h3>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-emerald-500">
          <p className="text-xs uppercase font-bold text-gray-500 mb-1">Current Progress</p>
          <h3 className="text-xl font-bold text-white">{completionPercentage}% Mastery</h3>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-purple-500">
          <p className="text-xs uppercase font-bold text-gray-500 mb-1">Tasks Done</p>
          <h3 className="text-xl font-bold text-white">{completedDays.size} / {plan.roadmap.length}</h3>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-amber-500">
          <p className="text-xs uppercase font-bold text-gray-500 mb-1">Future Longevity</p>
          <h3 className="text-xl font-bold text-white">{plan.futureOutlook.longevityScore}/100</h3>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl max-w-lg overflow-x-auto">
          {(['roadmap', 'gaps', 'market', 'future'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium capitalize transition-all whitespace-nowrap ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
              {tab === 'future' ? 'Future Outlook' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'roadmap' && (
          <div className="flex items-center gap-3 glass px-4 py-2 rounded-xl">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pacing:</span>
            <div className="flex bg-black/40 p-1 rounded-lg">
              <button 
                onClick={() => setIsSelfPaced(false)}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${!isSelfPaced ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                30-DAY SPRINT
              </button>
              <button 
                onClick={() => setIsSelfPaced(true)}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${isSelfPaced ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                SELF-PACED
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {activeTab === 'roadmap' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                {plan.roadmap.map((task, idx) => {
                  const isCompleted = completedDays.has(task.day);
                  return (
                    <div key={idx} className="relative group">
                      <div 
                        onClick={() => toggleTask(task.day)}
                        className={`absolute -left-[29px] top-1.5 w-[18px] h-[18px] rounded-full ring-4 z-10 cursor-pointer transition-all duration-300 flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-emerald-500 ring-emerald-500/20' 
                            : isSelfPaced ? 'bg-purple-600 ring-purple-600/20' : 'bg-blue-600 ring-blue-600/20'
                        }`}
                      >
                        {isCompleted && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className={`glass p-6 rounded-2xl border transition-all duration-300 space-y-4 ${isCompleted ? 'border-emerald-500/40 bg-emerald-500/5' : 'hover:border-blue-500/50'}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-bold mono ${isCompleted ? 'text-emerald-400' : isSelfPaced ? 'text-purple-400' : 'text-blue-400'}`}>
                              {isSelfPaced ? `MODULE ${idx + 1}` : `DAY ${task.day}`}
                            </span>
                            {isCompleted && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase tracking-widest animate-pulse">
                                Mastery Gained
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => toggleTask(task.day)}
                            className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-tighter transition-all ${
                              isCompleted ? 'bg-emerald-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                            }`}
                          >
                            {isCompleted ? 'Completed' : 'Mark Done'}
                          </button>
                        </div>
                        <h5 className={`font-bold text-xl tracking-tight transition-all ${isCompleted ? 'text-emerald-200 line-through opacity-50' : 'text-white'}`}>
                          {task.title}
                        </h5>
                        <p className={`text-sm leading-relaxed transition-all ${isCompleted ? 'text-gray-500 italic' : 'text-gray-400'}`}>
                          {task.description}
                        </p>
                        
                        {!isCompleted && (
                          <div className="grid grid-cols-1 gap-4 pt-2 animate-in fade-in slide-in-from-top-2">
                            <ResourceSection 
                              title="Learning Sources" 
                              resources={task.learningSources} 
                              color="text-emerald-400" 
                              icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>} 
                            />
                            <ResourceSection 
                              title="Mock Tests" 
                              resources={task.mockTests} 
                              color="text-amber-400" 
                              icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>} 
                            />
                            <ResourceSection 
                              title="Mock Interviews" 
                              resources={task.mockInterviews} 
                              color="text-purple-400" 
                              icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>} 
                            />
                          </div>
                        )}

                        <div className="pt-3 border-t border-white/5">
                          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Checkpoint</p>
                          <p className={`text-xs italic transition-all ${isCompleted ? 'text-emerald-600' : 'text-emerald-400'}`}>
                            “{task.checkpoint}”
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="lg:col-span-1 space-y-6 h-fit sticky top-24">
              <div className="glass p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-sm font-bold uppercase text-gray-500 tracking-wider">Live Skill Mapping</h4>
                  <span className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded font-mono">Real-time update</span>
                </div>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 600 }} />
                      <Radar name="Market Target" dataKey="B" stroke="#2563eb" fill="#2563eb" fillOpacity={0.05} />
                      <Radar name="Your Mastery" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', fontSize: '12px' }}
                        itemStyle={{ color: '#f3f4f6' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                   <p className="text-[10px] text-gray-500 leading-relaxed italic">
                     Check off tasks in the roadmap to shrink the gaps. Each checkmark represents specific competency growth matched against 2025 market benchmarks.
                   </p>
                   <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1.5">
                       <div className="w-2 h-2 rounded-full bg-blue-600" />
                       <span className="text-[10px] text-gray-400 font-bold uppercase">Target</span>
                     </div>
                     <div className="flex items-center gap-1.5">
                       <div className="w-2 h-2 rounded-full bg-emerald-500" />
                       <span className="text-[10px] text-gray-400 font-bold uppercase">Current</span>
                     </div>
                   </div>
                </div>
              </div>

              <div className="glass p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20">
                <h4 className="text-sm font-bold text-white mb-2">Navigator Tip</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Focus on tasks that align with your highest skill gaps (weighted by importance in the analysis tab). Completing "Module 1" early provides the highest ROI for your longevity score.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gaps' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.gaps.map((gap, i) => (
              <div key={i} className="glass p-6 rounded-2xl space-y-3">
                <h5 className="font-bold text-white text-lg">{gap.skill}</h5>
                <p className="text-sm text-gray-400">{gap.gapDescription}</p>
                <p className="text-xs text-gray-300 italic">Market: {gap.marketDemand}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'market' && (
          <div className="glass p-8 rounded-3xl space-y-6">
            <h4 className="text-2xl font-bold tracking-tight">Market Alignment</h4>
            <div className="prose prose-invert max-w-none text-gray-400 leading-loose whitespace-pre-wrap">{plan.marketAnalysis}</div>
          </div>
        )}

        {activeTab === 'future' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl space-y-6">
              <h4 className="text-2xl font-bold text-white">10-Year Evolution</h4>
              <p className="text-gray-300 leading-relaxed text-lg">{plan.futureOutlook.summary}</p>
            </div>
            <div className="glass p-8 rounded-3xl space-y-6">
              <h4 className="text-xl font-bold text-white">Technological Shifts</h4>
              <ul className="space-y-3">
                {plan.futureOutlook.technologicalShifts.map((shift, i) => (
                  <li key={i} className="text-gray-400 text-sm flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />{shift}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
