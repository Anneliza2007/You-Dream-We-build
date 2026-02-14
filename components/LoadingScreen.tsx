
import React from 'react';
import { AgentLog } from '../types';

interface Props {
  logs: AgentLog[];
  quote?: string;
}

const LoadingScreen: React.FC<Props> = ({ logs, quote }) => {
  return (
    <div className="max-w-3xl mx-auto py-20 flex flex-col items-center justify-center space-y-12">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center font-bold text-blue-500 animate-pulse">
          AI
        </div>
      </div>
      
      <div className="w-full space-y-4 text-center">
        <h3 className="text-2xl font-bold tracking-tight text-white">Architecting your future...</h3>
        <p className="text-gray-400 text-sm">Orchestrating multi-agent reasoning flow.</p>
      </div>

      {quote && (
        <div className="w-full text-center py-6 px-4 quote-highlight animate-in fade-in duration-1000">
          <p className="quote-font font-black italic text-2xl md:text-3xl text-blue-300 drop-shadow-lg">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      )}

      <div className="w-full glass rounded-2xl p-6 space-y-3 mono text-xs h-64 overflow-y-auto">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-blue-400">[{log.timestamp.toLocaleTimeString()}]</span>
            <span className="text-gray-500 uppercase font-bold tracking-tighter">[{log.agent}]</span>
            <span className="text-gray-200">{log.message}</span>
          </div>
        ))}
        {logs.length === 0 && <div className="text-gray-600 italic">Initializing sub-agents...</div>}
      </div>
    </div>
  );
};

export default LoadingScreen;
