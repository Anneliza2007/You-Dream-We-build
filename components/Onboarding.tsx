
import React, { useState, useRef } from 'react';
import { MultiSourceData, QuizQuestion } from '../types';

interface Props {
  type: 'name' | 'age' | 'quiz' | 'profile' | 'role';
  onSubmit: (data: any) => void;
  extraData?: any;
  quote?: string;
}

const QuoteDisplay: React.FC<{ quote?: string; hero?: boolean }> = ({ quote, hero }) => {
  if (!quote) return null;
  return (
    <div className={`w-full text-center py-12 px-8 quote-highlight animate-in fade-in zoom-in duration-1000 ${hero ? 'mb-16' : 'my-10'}`}>
      <p className={`quote-font font-black italic text-blue-400 drop-shadow-xl leading-[1.1] tracking-tight ${hero ? 'text-5xl md:text-6xl lg:text-7xl xl:text-8xl' : 'text-3xl md:text-4xl'}`}>
        &ldquo;{quote}&rdquo;
      </p>
    </div>
  );
};

const Onboarding: React.FC<Props> = ({ type, onSubmit, extraData, quote }) => {
  // Common state
  const [inputValue, setInputValue] = useState('');

  // Quiz state
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Profile state
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessingPdf(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const typedarray = new Uint8Array(reader.result as ArrayBuffer);
        // @ts-ignore
        const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map((item: any) => item.str).join(' ') + '\n';
        }
        setResumeText(fullText);
        setIsProcessingPdf(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setIsProcessingPdf(false);
    }
  };

  if (type === 'name') {
    return (
      <div className="max-w-6xl mx-auto py-12 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <QuoteDisplay quote={quote} hero={true} />
        
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-extrabold text-white tracking-tight">Welcome, Pioneer.</h2>
            <p className="text-gray-400 text-lg">What shall we call you on this journey?</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (inputValue.trim()) onSubmit(inputValue.trim()); }} className="space-y-6">
            <input
              type="text"
              className="w-full glass rounded-2xl px-8 py-6 text-3xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-800"
              placeholder="Your Name"
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" disabled={!inputValue.trim()} className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-blue-900/40 disabled:opacity-50 active:scale-95">
              Begin Journey
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (type === 'age') {
    return (
      <div className="max-w-md mx-auto py-16 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-white">Next, your age</h2>
          <p className="text-gray-400">Every stage of life holds a different vision.</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (inputValue) onSubmit(parseInt(inputValue)); }} className="space-y-6">
          <input
            type="number"
            className="w-full glass rounded-2xl px-8 py-6 text-4xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-800"
            placeholder="00"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" disabled={!inputValue} className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-blue-900/40 disabled:opacity-50 active:scale-95">
            Continue
          </button>
        </form>
        <QuoteDisplay quote={quote} />
      </div>
    );
  }

  if (type === 'quiz') {
    const questions = extraData as QuizQuestion[];
    const answeredCount = Object.keys(answers).length;
    const isComplete = questions && answeredCount === questions.length;
    const progress = questions ? (answeredCount / questions.length) * 100 : 0;

    return (
      <div className="max-w-2xl mx-auto py-12 space-y-12 animate-in fade-in duration-500">
        <div className="text-center space-y-3 sticky top-24 bg-gray-950/80 backdrop-blur-md py-4 z-20 rounded-2xl border border-white/5">
          <h2 className="text-3xl font-bold text-white">Discovery Quiz</h2>
          <p className="text-gray-400">Question {answeredCount} of {questions.length}</p>
          <div className="w-full h-1 bg-white/5 rounded-full mt-4 max-w-xs mx-auto overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
        
        <div className="space-y-8">
          {questions.map((q, idx) => (
            <div key={idx} className={`glass p-6 rounded-2xl border transition-all duration-500 ${answers[idx] ? 'border-blue-500/30' : 'border-white/5'}`}>
              <h4 className="text-lg font-medium text-white mb-6">
                <span className="text-blue-500 font-bold mr-2">{idx + 1}.</span> {q.question}
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {q.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => setAnswers({ ...answers, [idx]: opt })}
                    className={`p-4 rounded-xl text-left text-sm border transition-all ${
                      answers[idx] === opt ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.2)]' : 'glass border-white/5 text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          <QuoteDisplay quote={quote} />

          <div className="sticky bottom-8 py-4">
            <button
              onClick={() => onSubmit(questions.map((q, i) => ({ question: q.question, answer: answers[i] })))}
              disabled={!isComplete}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-emerald-900/40 disabled:opacity-30 active:scale-95"
            >
              {isComplete ? 'Reveal My Potential' : `Complete ${questions.length - answeredCount} more to continue`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-3 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-white">Synthesize Your Profile</h2>
          <p className="text-gray-400 text-lg">Your data is the foundation of our predictive analysis.</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ linkedinText: linkedin, githubInfo: github, resumeText: resumeText } as MultiSourceData); }} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="input-card glass p-6 rounded-2xl border border-white/5 space-y-4 group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </div>
                <h3 className="font-bold text-white">LinkedIn</h3>
              </div>
              <textarea className="w-full h-32 bg-black/40 rounded-xl p-4 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" placeholder="Paste LinkedIn profile text..." value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
            </div>
            <div className="input-card glass p-6 rounded-2xl border border-white/5 space-y-4 group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-gray-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </div>
                <h3 className="font-bold text-white">GitHub</h3>
              </div>
              <textarea className="w-full h-32 bg-black/40 rounded-xl p-4 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none" placeholder="Paste GitHub repository data..." value={github} onChange={(e) => setGithub(e.target.value)} />
            </div>
            <div className="input-card glass p-6 rounded-2xl border border-white/5 space-y-4 group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center text-emerald-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <h3 className="font-bold text-white">Resume</h3>
              </div>
              <div onClick={() => fileInputRef.current?.click()} className={`w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${resumeText ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-black/40'}`}>
                {isProcessingPdf ? <div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full" /> : resumeText ? <span className="text-[10px] text-emerald-400 font-bold uppercase">Parsed</span> : <span className="text-xs text-gray-500">Upload PDF</span>}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handlePdfUpload} />
            </div>
          </div>
          <QuoteDisplay quote={quote} />
          <button type="submit" disabled={!linkedin && !github && !resumeText} className="w-full py-4 bg-blue-600 rounded-xl font-bold text-lg disabled:opacity-50 active:scale-95">Consolidate Identity</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-3 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white">Select Your Target</h2>
        <p className="text-gray-400">Where does your ambition lie?</p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (inputValue.trim()) onSubmit(inputValue.trim()); }} className="space-y-6">
        <input
          type="text"
          className="w-full glass rounded-2xl px-8 py-6 text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700"
          placeholder="e.g. Senior Product Architect"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" disabled={!inputValue.trim()} className="w-full py-5 bg-blue-600 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-blue-900/40 active:scale-95">Architect My Path</button>
      </form>
      <QuoteDisplay quote={quote} />
    </div>
  );
};

export default Onboarding;
