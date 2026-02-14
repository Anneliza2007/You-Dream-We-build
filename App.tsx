
import React, { useState } from 'react';
import { AppStep, Profile, CareerPlan, AgentLog, MultiSourceData, QuizQuestion } from './types';
import { analyzeProfile, architectCareerPlan, generateCareerQuiz, evaluateQuizResults } from './geminiService';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import LoadingScreen from './components/LoadingScreen';
import SystemArch from './components/SystemArch';

const MOTIVATIONAL_QUOTES = [
  "The only way to do great work is to love what you do.",
  "Your time is limited, so don't waste it living someone else's life.",
  "The future depends on what you do today.",
  "Believe you can and you're halfway there.",
  "Strive not to be a success, but rather to be of value.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "Everything you’ve ever wanted is on the other side of fear.",
  "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work."
];

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.NAME_INPUT);
  const [userName, setUserName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [plan, setPlan] = useState<CareerPlan | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [dreamRole, setDreamRole] = useState('');
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [showArch, setShowArch] = useState(false);

  const addLog = (agent: string, message: string) => {
    setLogs(prev => [...prev, { agent, message, timestamp: new Date() }]);
  };

  const getRandomQuote = () => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setStep(AppStep.AGE_INPUT);
  };

  const handleAgeSubmit = async (val: number) => {
    setAge(val);
    if (val < 18) {
      setStep(AppStep.ANALYZING);
      addLog('Guidance Agent', `Preparing curiosity-based quiz for ${userName}...`);
      try {
        const questions = await generateCareerQuiz(val);
        setQuizQuestions(questions);
        setStep(AppStep.QUIZ);
      } catch (err) {
        setStep(AppStep.AGE_INPUT);
      }
    } else {
      setStep(AppStep.PROFILE_INPUT);
    }
  };

  const handleQuizSubmit = async (answers: { question: string, answer: string }[]) => {
    setStep(AppStep.ANALYZING);
    addLog('Career Predictor', `Analyzing ${userName}'s interests and potential...`);
    try {
      if (age) {
        const result = await evaluateQuizResults(age, answers);
        setPlan({
          dreamRole: 'Future Explorer',
          marketAnalysis: result.generalAdvice,
          gaps: [],
          roadmap: [],
          futureOutlook: {
            summary: "Your career is a blank canvas. Start painting today.",
            technologicalShifts: ["Hyper-Personalization", "General AI Assistants", "Space Economy"],
            emergingSkills: ["Prompt Engineering", "Digital Literacy", "Emotional Intelligence"],
            riskFactor: 'Low',
            longevityScore: 100
          },
          under18Result: result
        });
        setStep(AppStep.DASHBOARD);
      }
    } catch (err) {
      setStep(AppStep.AGE_INPUT);
    }
  };

  const handleProfileSubmit = async (sources: MultiSourceData) => {
    setStep(AppStep.ANALYZING);
    addLog('Profile Analyzer', `Synthesizing ${userName}'s professional data...`);
    try {
      const result = await analyzeProfile(sources);
      setProfile({ ...result, name: userName, age: age || undefined });
      addLog('Profile Analyzer', 'Consolidated profile successfully created.');
      setStep(AppStep.DREAM_ROLE);
    } catch (error) {
      addLog('System', 'Synthesis failed. Please try again.');
      setStep(AppStep.PROFILE_INPUT);
    }
  };

  const handleRoleSubmit = async (role: string) => {
    setDreamRole(role);
    setStep(AppStep.ANALYZING);
    addLog('Market Insights Agent', `Architecting the path for ${userName} to become a ${role}...`);
    try {
      if (profile) {
        const result = await architectCareerPlan(profile, role);
        setPlan(result);
        addLog('Gap Architect', 'Mapping individual competencies to market benchmarks.');
        setStep(AppStep.DASHBOARD);
      }
    } catch (error) {
      addLog('System', 'Agent reasoning failed.');
      setStep(AppStep.DREAM_ROLE);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 px-6 py-4 flex justify-between items-center glass sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">P</div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Personal Career Navigator</h1>
            <p className="text-xs text-gray-400 mono">Agentic Career Co-pilot v1.3</p>
          </div>
        </div>
        <button onClick={() => setShowArch(!showArch)} className="text-xs font-medium px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
          {showArch ? 'Back to App' : 'System Architecture'}
        </button>
      </header>

      <main className="flex-1 container mx-auto p-6 max-w-6xl">
        {showArch ? <SystemArch /> : (
          <>
            {step === AppStep.NAME_INPUT && <Onboarding type="name" onSubmit={handleNameSubmit} quote={getRandomQuote()} />}
            {step === AppStep.AGE_INPUT && <Onboarding type="age" onSubmit={handleAgeSubmit} quote={getRandomQuote()} />}
            {step === AppStep.QUIZ && <Onboarding type="quiz" onSubmit={handleQuizSubmit} extraData={quizQuestions} quote={getRandomQuote()} />}
            {step === AppStep.PROFILE_INPUT && <Onboarding type="profile" onSubmit={handleProfileSubmit} quote={getRandomQuote()} />}
            {step === AppStep.DREAM_ROLE && <Onboarding type="role" onSubmit={handleRoleSubmit} quote={getRandomQuote()} />}
            {step === AppStep.ANALYZING && <LoadingScreen logs={logs} quote={getRandomQuote()} />}
            {step === AppStep.DASHBOARD && plan && <Dashboard profile={profile || { name: userName, age: age || 0, currentTitle: '', experience: [], skills: [], education: [] }} plan={plan} quote={getRandomQuote()} />}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
