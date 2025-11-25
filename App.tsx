import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import { Message, Sender } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { Send, Sparkles, Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Initial greeting
  useEffect(() => {
    setHistory([
      {
        id: 'init-1',
        sender: Sender.Bot,
        text: "**System Initialized.**\n\nChào bạn, tôi là InsightStream - Hệ thống phân tích dữ liệu Real-time.\n\nTôi có thể giúp gì cho bạn hôm nay?\n\n*Ví dụ:*\n- *Giá vàng SJC hôm nay tại Hà Nội là bao nhiêu?*\n- *Phân tích kết quả kinh doanh Apple quý vừa rồi.*",
        timestamp: Date.now(),
      }
    ]);
  }, []);

  const handleSend = async () => {
    if (!query.trim() || isProcessing) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: Sender.User,
      text: query,
      timestamp: Date.now(),
    };

    setHistory((prev) => [...prev, userMsg]);
    setQuery('');
    setIsProcessing(true);

    // Placeholder for Bot while loading
    const tempBotId = (Date.now() + 1).toString();
    const loadingMsg: Message = {
      id: tempBotId,
      sender: Sender.Bot,
      text: '', // Empty initially
      timestamp: Date.now(),
      isLoading: true,
    };
    setHistory((prev) => [...prev, loadingMsg]);

    try {
      const response = await sendMessageToGemini(userMsg.text, history);
      
      setHistory((prev) => 
        prev.map(msg => 
          msg.id === tempBotId 
            ? { ...msg, ...response, isLoading: false, id: Date.now().toString() } 
            : msg
        )
      );
    } catch (error) {
      setHistory((prev) => 
        prev.map(msg => 
          msg.id === tempBotId 
            ? { 
                ...msg, 
                isLoading: false, 
                text: `**System Error:** Encountered a critical fault. \n\n\`${error instanceof Error ? error.message : 'Unknown error'}\`` 
              } 
            : msg
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans">
      <Header />

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
        
        {/* Background Grid Effect */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-20" 
             style={{ 
               backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>
        <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>

        <div className="max-w-5xl mx-auto relative z-10 min-h-full pb-32">
          {history.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="w-full bg-[#020617] border-t border-white/10 p-4 relative z-20">
        <div className="max-w-4xl mx-auto relative">
          
          <div className="absolute -top-12 left-0 right-0 flex justify-center pointer-events-none">
             {isProcessing && (
                <div className="bg-cyan-500/10 backdrop-blur-md border border-cyan-500/20 text-cyan-400 text-xs px-4 py-2 rounded-full flex items-center gap-2 animate-bounce">
                  <Sparkles size={14} />
                  <span>Processing realtime logic stream...</span>
                </div>
             )}
          </div>

          <div className="relative group rounded-2xl p-[1px] bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 focus-within:from-cyan-500 focus-within:via-blue-500 focus-within:to-purple-600 transition-all duration-300">
            <div className="bg-slate-900 rounded-2xl flex items-end overflow-hidden">
               <div className="pl-4 py-4 text-slate-500">
                  <Terminal size={20} />
               </div>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask for real-time analysis (e.g., 'So sánh giá iPhone 15 tại các đại lý lớn VN')..."
                className="w-full bg-transparent border-0 focus:ring-0 text-slate-200 placeholder-slate-500 resize-none py-4 px-4 min-h-[60px] max-h-[200px]"
                rows={1}
                disabled={isProcessing}
              />
              <button
                onClick={handleSend}
                disabled={!query.trim() || isProcessing}
                className={`m-2 p-3 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  query.trim() && !isProcessing
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-900/20'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Send size={20} className={query.trim() && !isProcessing ? 'ml-0.5' : ''} />
              </button>
            </div>
          </div>
          
          <div className="mt-3 text-center text-[10px] text-slate-600 flex justify-center gap-4">
             <span>Gemini 2.5 Flash</span>
             <span>•</span>
             <span>Real-time Google Search Grounding</span>
             <span>•</span>
             <span>Auto-Visualization</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
