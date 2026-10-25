import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ChefHat, Send, X, RotateCcw, 
  ShoppingBag, Flame, MessageSquare, ChevronDown, Check, ArrowRight
} from 'lucide-react';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data/menu';

interface ChatTurn {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface GeminiChatbotProps {
  onQuickAddToCart: (item: MenuItem) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  onQuickAddToCart,
  isOpen,
  onToggle
}) => {
  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      id: 'msg-welcome',
      role: 'model',
      text: "Bonjour! I am Chef Antoine, your Executive Burger Sommelier. Allow me to pair our 550°F cast iron smash burgers, A5 Wagyu blends, and artisanal hand-spun shakes to your exact flavor profile. What flavors are you craving today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemName, setAddedItemName] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || isTyping) return;

    const userTurn: ChatTurn = {
      id: 'user-' + Date.now(),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userTurn];
    setMessages(newHistory);
    setInput('');
    setIsTyping(true);

    try {
      // Format multi-turn history for Gemini server endpoint
      const formattedHistory = newHistory.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/gemini/sommelier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: formattedHistory.slice(0, -1), // previous turns
          message: textToSend
        })
      });

      const data = await res.json();
      const modelTurn: ChatTurn = {
        id: 'model-' + Date.now(),
        role: 'model',
        text: data.reply || "Chef Antoine has noted your preference! Our cast iron is primed for you.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelTurn]);
    } catch (err) {
      console.error('Gemini chatbot error:', err);
      const fallbackTurn: ChatTurn = {
        id: 'model-err-' + Date.now(),
        role: 'model',
        text: "Pardonnez-moi! The kitchen connection momentarily flickered. Our Saffron Ember Smash and Truffle Wagyu are both sizzling right now!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackTurn]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'msg-reset',
        role: 'model',
        text: "Conversation refreshed. Chef Antoine at your service—what culinary journey shall we embark on?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Helper to detect if a menu item is referenced in Chef's message
  const detectRecommendedItem = (text: string): MenuItem | null => {
    for (const item of MENU_ITEMS) {
      if (text.toLowerCase().includes(item.name.toLowerCase())) {
        return item;
      }
    }
    return null;
  };

  const handleAddRecommended = (item: MenuItem) => {
    onQuickAddToCart(item);
    setAddedItemName(item.name);
    setTimeout(() => setAddedItemName(null), 2500);
  };

  const samplePrompts = [
    "Recommend a burger for truffle lovers",
    "What side & drink pair best with the Saffron Smash?",
    "Explain the science behind the 550°F Maillard crust",
    "What makes your Wagyu blend unique?"
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#13151b] hover:bg-[#181a22] text-white rounded-full border border-amber-500/30 shadow-2xl shadow-black/80 cursor-pointer backdrop-blur-md transition-all duration-200"
          aria-label="Open Gemini Chef AI Sommelier"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-zinc-950 font-bold shadow-md">
              <ChefHat className="w-4 h-4 text-zinc-950" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#13151b]" />
          </div>

          <div className="text-left hidden sm:block">
            <span className="text-[10px] font-mono-num text-amber-400 uppercase tracking-widest block leading-none">
              Gemini 3.8 Flash
            </span>
            <span className="text-xs font-bold font-display text-white tracking-wide uppercase">
              Chef Sommelier AI
            </span>
          </div>

          <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform duration-200" />
        </motion.button>
      </div>

      {/* Main Multi-Turn Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-22 left-4 sm:left-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[80vh] bg-[#0e0f14] border border-white/10 rounded-2xl shadow-2xl shadow-black/90 flex flex-col overflow-hidden text-left"
          >
            {/* Header */}
            <div className="p-4 bg-[#14161f] border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-zinc-950 shadow-md">
                  <ChefHat className="w-5 h-5 text-zinc-950" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold font-display text-white tracking-wide uppercase">
                      Chef Antoine
                    </h3>
                    <span className="text-[9px] font-mono-num bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded">
                      Sommelier
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono-num">
                    Powered by Gemini 3.8 Flash
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearHistory}
                  title="Reset conversation"
                  aria-label="Reset conversation"
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={onToggle}
                  aria-label="Close chatbot"
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-[#0b0c10]">
              {messages.map((turn) => {
                const isUser = turn.role === 'user';
                const recItem = !isUser ? detectRecommendedItem(turn.text) : null;

                return (
                  <div
                    key={turn.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[10px] font-mono-num text-zinc-500 uppercase tracking-wider">
                        {isUser ? 'You' : 'Chef Antoine'}
                      </span>
                      <span className="text-[9px] text-zinc-600 font-mono-num">· {turn.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line text-xs shadow-md ${
                        isUser
                          ? 'bg-amber-400 text-zinc-950 font-medium rounded-tr-none'
                          : 'bg-[#151720] text-zinc-200 border border-white/5 rounded-tl-none'
                      }`}
                    >
                      {turn.text}
                    </div>

                    {/* Interactive Item Recommendation Card */}
                    {recItem && (
                      <div className="mt-2.5 max-w-[88%] p-3 bg-zinc-900/90 rounded-xl border border-amber-500/30 flex items-center justify-between gap-3 shadow-lg">
                        <img
                          src={recItem.image}
                          alt={recItem.name}
                          className="w-12 h-12 rounded-lg object-cover bg-zinc-800 shrink-0 border border-white/5"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-mono-num text-amber-400 uppercase tracking-wider block">
                            Chef Recommendation
                          </span>
                          <h4 className="text-xs font-bold text-white font-display truncate">
                            {recItem.name}
                          </h4>
                          <span className="text-xs font-mono-num font-bold text-zinc-300">
                            ${recItem.price.toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleAddRecommended(recItem)}
                          className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-[11px] rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                        >
                          {addedItemName === recItem.name ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-zinc-950" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5 text-zinc-950" />
                              <span>Add to Bag</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex flex-col items-start">
                  <div className="text-[10px] font-mono-num text-zinc-500 uppercase tracking-wider mb-1 px-1">
                    Chef Antoine is composing...
                  </div>
                  <div className="p-3 bg-[#151720] rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={scrollRef} />
            </div>

            {/* Starter Suggestion Chips */}
            {messages.length <= 2 && (
              <div className="px-3 py-2 bg-[#12131a] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto shrink-0">
                {samplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="px-2.5 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[10px] whitespace-nowrap shrink-0 transition-colors border border-white/5 cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-[#14161f] border-t border-white/10 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Chef Antoine about pairings, crust science, or recipes..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-zinc-950 font-bold rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
