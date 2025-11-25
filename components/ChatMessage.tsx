import React from 'react';
import { Message, Sender } from '../types';
import ReactMarkdown from 'react-markdown';
import AnalyticsChart from './AnalyticsChart';
import { User, Bot, ExternalLink, Loader2, CheckCircle2, Search, Cpu } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === Sender.Bot;

  return (
    <div className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} mb-8 animate-fade-in-up`}>
      <div className={`flex max-w-4xl w-full gap-4 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border shadow-lg ${
          isBot 
            ? 'bg-cyan-950/50 border-cyan-800 text-cyan-400' 
            : 'bg-indigo-950/50 border-indigo-800 text-indigo-400'
        }`}>
          {isBot ? <Bot size={20} /> : <User size={20} />}
        </div>

        {/* Content Bubble */}
        <div className={`flex-1 min-w-0 flex flex-col items-start`}>
          
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-sm font-bold ${isBot ? 'text-cyan-400' : 'text-indigo-400'}`}>
              {isBot ? 'System Intelligence' : 'User Query'}
            </span>
            <span className="text-xs text-slate-500">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <div className={`relative px-6 py-5 rounded-2xl w-full border backdrop-blur-sm ${
            isBot 
              ? 'bg-slate-900/60 border-slate-700 text-slate-200' 
              : 'bg-indigo-600/10 border-indigo-500/30 text-indigo-100'
          }`}>
            
            {/* Loading State for Bot */}
            {isBot && message.isLoading && (
              <div className="space-y-4">
                 <div className="flex items-center gap-3 text-cyan-400 animate-pulse">
                    <Cpu size={18} />
                    <span className="text-sm font-mono">Analyzing Request parameters...</span>
                 </div>
                 <div className="flex items-center gap-3 text-blue-400 animate-pulse delay-75">
                    <Search size={18} />
                    <span className="text-sm font-mono">Querying Global Index (Live)...</span>
                 </div>
                 <div className="flex items-center gap-3 text-emerald-400 animate-pulse delay-150">
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-mono">Verifying Data Integrity...</span>
                 </div>
                 <div className="mt-4 p-4 rounded-lg bg-black/20 border border-white/5 space-y-2">
                    <div className="h-2 w-3/4 bg-slate-700/50 rounded animate-pulse"></div>
                    <div className="h-2 w-1/2 bg-slate-700/50 rounded animate-pulse"></div>
                    <div className="h-2 w-full bg-slate-700/50 rounded animate-pulse"></div>
                 </div>
              </div>
            )}

            {/* Content Render */}
            {!message.isLoading && (
              <>
                <div className="prose prose-invert prose-sm md:prose-base max-w-none 
                  prose-headings:text-cyan-100 prose-headings:font-bold 
                  prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white prose-strong:font-bold
                  prose-code:text-emerald-300 prose-code:bg-emerald-950/30 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                  prose-ul:marker:text-slate-500
                ">
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>

                {/* Visualization Injection */}
                {message.visualization && (
                  <AnalyticsChart data={message.visualization} />
                )}

                {/* Sources / Grounding */}
                {message.groundingSources && message.groundingSources.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ExternalLink size={14} />
                      Verified Sources
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {message.groundingSources.map((source, idx) => (
                        <a 
                          key={idx}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 rounded-lg bg-black/20 hover:bg-black/40 border border-white/5 hover:border-cyan-500/30 transition-all group"
                        >
                          <div className="w-1 h-full min-h-[16px] bg-cyan-500/50 rounded-full"></div>
                          <span className="text-xs text-slate-300 truncate group-hover:text-cyan-300 transition-colors">
                            {source.title}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
