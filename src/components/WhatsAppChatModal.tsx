import React, { useState, useEffect, useRef } from 'react';
import { Order, ChatMessage } from '../types';
import { 
  X, Send, Phone, Video, MoreVertical, CheckCheck, Clock, 
  ExternalLink, ChefHat, Sparkles, AlertCircle, ArrowLeft,
  Flame, ShoppingBag, ShieldCheck
} from 'lucide-react';

interface WhatsAppChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const WhatsAppChatModal: React.FC<WhatsAppChatModalProps> = ({
  isOpen,
  onClose,
  order,
  onUpdateOrder
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [order.chatHistory, isTyping]);

  // Initial automatic greeting / confirmation if not already present
  useEffect(() => {
    if (order.chatHistory.length === 1 && order.chatHistory[0].sender === 'customer') {
      setIsTyping(true);
      const timer = setTimeout(async () => {
        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: order.chatHistory[0].text,
              orderContext: order,
              chatHistory: []
            })
          });
          const data = await res.json();
          const replyText = data.reply || `Bonjour! 🔥 Order ${order.orderNumber} is confirmed! Our kitchen line is firing up your patties on 550°F cast iron now.`;

          const botMsg: ChatMessage = {
            id: 'bot-' + Date.now(),
            sender: 'concierge',
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          const updated: Order = {
            ...order,
            status: 'confirmed',
            chatHistory: [...order.chatHistory, botMsg]
          };

          onUpdateOrder(updated);

          // Sync to server
          await fetch(`/api/orders/${order.id}/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: botMsg })
          });
        } catch (err) {
          console.error('AI chat failed:', err);
        } finally {
          setIsTyping(false);
        }
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [order.id]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: 'cust-' + Date.now(),
      sender: 'customer',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newChatHistory = [...order.chatHistory, userMsg];
    const interimOrder: Order = {
      ...order,
      chatHistory: newChatHistory
    };
    onUpdateOrder(interimOrder);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          orderContext: order,
          chatHistory: newChatHistory
        })
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'concierge',
        text: data.reply || 'Understood! Relaying this immediately to the head chef on duty.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalOrder: Order = {
        ...interimOrder,
        chatHistory: [...newChatHistory, botMsg]
      };
      onUpdateOrder(finalOrder);

      // Sync to server
      await fetch(`/api/orders/${order.id}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: botMsg })
      });
    } catch (err) {
      console.error('Error contacting AI chat:', err);
    } finally {
      setIsTyping(false);
    }
  };

  // Generate real wa.me link
  const generateNativeWhatsAppUrl = () => {
    const itemsText = order.items.map(i => `${i.quantity}x ${i.item.name} ($${(i.calculatedPrice * i.quantity).toFixed(2)})`).join('\n');
    const fullText = `*EMBER & BRIOCHE ATELIER ORDER*\nOrder Number: ${order.orderNumber}\nCustomer: ${order.customerName}\nPhone: ${order.customerPhone}\nAddress: ${order.deliveryAddress}\nType: ${order.orderType.toUpperCase()}\n\n*Items:*\n${itemsText}\n\n*Total:* $${order.total.toFixed(2)}\nSpecial Notes: ${order.notes || 'None'}`;
    return `https://wa.me/?text=${encodeURIComponent(fullText)}`;
  };

  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case 'new': return 1;
      case 'confirmed': return 2;
      case 'grilling': return 3;
      case 'out_for_delivery': return 4;
      case 'delivered': return 5;
      default: return 2;
    }
  };

  const currentStep = getStatusStepIndex(order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0b141a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] sm:h-[80vh] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header: WhatsApp Style */}
        <div className="px-4 py-3 bg-[#202c33] border-b border-[#2a3942] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 text-[#aebac1] hover:text-white rounded-full sm:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Atelier Concierge Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold font-display text-lg">
                🔥
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#202c33] rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-semibold text-[#e9edef] truncate">
                  Ember & Brioche Concierge
                </h3>
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                  ✓
                </span>
              </div>
              <div className="text-[11px] text-[#8696a0] font-mono-num flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI Kitchen Dispatch · Active Ticket {order.orderNumber}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={generateNativeWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#00a884]/20 hover:bg-[#00a884]/30 text-[#00a884] border border-[#00a884]/40 rounded-lg text-xs font-medium transition-colors"
              title="Open pre-filled ticket in native WhatsApp app or WhatsApp Web"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-[#aebac1] hover:text-white rounded-lg hover:bg-[#111b21] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Order Status Stepper Bar */}
        <div className="px-4 py-2.5 bg-[#111b21] border-b border-[#222e35] text-xs">
          <div className="flex items-center justify-between text-[11px] font-mono-num text-[#8696a0] mb-1.5">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Status: {order.status.toUpperCase().replace('_', ' ')}</span>
            </span>
            <span>Est: ~{order.estimatedMinutes} mins</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            <div className={`h-1.5 rounded-full ${currentStep >= 1 ? 'bg-emerald-500' : 'bg-[#2a3942]'}`} />
            <div className={`h-1.5 rounded-full ${currentStep >= 2 ? 'bg-emerald-500' : 'bg-[#2a3942]'}`} />
            <div className={`h-1.5 rounded-full ${currentStep >= 3 ? 'bg-amber-400' : 'bg-[#2a3942]'}`} />
            <div className={`h-1.5 rounded-full ${currentStep >= 4 ? 'bg-emerald-500' : 'bg-[#2a3942]'}`} />
          </div>
        </div>

        {/* Chat Message Stream */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b141a] relative"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        >
          {/* Encryption / Trust Notice */}
          <div className="flex justify-center my-2">
            <div className="px-3 py-1 bg-[#182229] border border-[#2a3942] rounded-lg text-[10px] text-[#ffd279] text-center max-w-sm flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Direct WhatsApp relay with EMBER AI Concierge. Orders are synced with kitchen line.</span>
            </div>
          </div>

          {/* Messages */}
          {order.chatHistory.map((msg) => {
            const isCustomer = msg.sender === 'customer';
            const isKitchen = msg.sender === 'kitchen';

            return (
              <div
                key={msg.id}
                className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-2.5 text-xs shadow-md ${
                    isCustomer
                      ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
                      : isKitchen
                      ? 'bg-[#2a3942] text-amber-300 rounded-tl-none border border-amber-500/30'
                      : 'bg-[#202c33] text-[#e9edef] rounded-tl-none border border-[#2a3942]'
                  }`}
                >
                  {/* Sender Label */}
                  {!isCustomer && (
                    <div className="text-[10px] font-bold font-mono-num text-amber-400 mb-1 flex items-center gap-1">
                      {isKitchen ? <Flame className="w-3 h-3 text-orange-400" /> : <Sparkles className="w-3 h-3 text-amber-400" />}
                      <span>{isKitchen ? 'KITCHEN BRIGADE' : 'EMBER CONCIERGE'}</span>
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Timestamp & Read Receipts */}
                  <div className="flex items-center justify-end gap-1 text-[10px] text-[#8696a0] mt-1 font-mono-num">
                    <span>{msg.timestamp}</span>
                    {isCustomer && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#202c33] rounded-2xl px-4 py-3 rounded-tl-none border border-[#2a3942] flex items-center gap-1.5 text-xs text-[#8696a0]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-mono-num ml-1 text-zinc-400">Concierge analyzing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#111b21] border-t border-[#222e35] flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => handleSendMessage('Can you add extra smoked saffron remoulade on the side?')}
            className="px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-[#2a3942] border border-[#2a3942] text-[11px] text-[#e9edef] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            + Extra Saffron Sauce
          </button>
          <button
            onClick={() => handleSendMessage('What is the current estimated delivery ETA for my order?')}
            className="px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-[#2a3942] border border-[#2a3942] text-[11px] text-[#e9edef] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            ⏱️ Delivery ETA?
          </button>
          <button
            onClick={() => handleSendMessage('Is the beef 100% Halal and grass-fed?')}
            className="px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-[#2a3942] border border-[#2a3942] text-[11px] text-[#e9edef] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            🥩 Halal / Dietary info
          </button>
          <button
            onClick={() => handleSendMessage('Please tell the courier to ring doorbell twice upon arrival.')}
            className="px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-[#2a3942] border border-[#2a3942] text-[11px] text-[#e9edef] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            🔔 Delivery Note
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#202c33] border-t border-[#2a3942] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type message to EMBER WhatsApp Concierge..."
            className="flex-1 px-4 py-2.5 rounded-lg bg-[#2a3942] border border-transparent text-xs text-[#e9edef] placeholder-[#8696a0] focus:outline-none focus:border-[#00a884]"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-lg bg-[#00a884] hover:bg-[#009575] disabled:opacity-40 text-[#111b21] transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
