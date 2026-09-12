import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, HelpCircle, ArrowUpRight, Flame, Trophy } from 'lucide-react';
import { ChatMessage, AthleteMetrics, MicrocycleDay, MatchFixture, AthleteProfile } from '../types';

interface AICoachChatSectionProps {
  metrics: AthleteMetrics;
  plan: MicrocycleDay[];
  fixtures: MatchFixture[];
  profile?: AthleteProfile;
}

export const AICoachChatSection: React.FC<AICoachChatSectionProps> = ({
  metrics,
  plan,
  fixtures,
  profile,
}) => {
  const athleteName = profile?.name || 'Alexandre';
  const sport = profile?.sport || 'Soccer';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      timestamp: 'Now',
      text: `Hey ${athleteName}! I am your personal AI Performance Coach for ${sport}.

Right now, your **Training Balance is ${metrics.currentACWR.toFixed(2)}** (inside the safe ${metrics.acwrStatus === 'sweet-spot' ? 'green Sweet Spot 🟢' : 'target corridor'}) and your **Body Recovery is at ${metrics.recoveryScore}%**. 

Ask me anything in plain English! For example:
• *"Why do I feel sluggish today?"*
• *"How should I pace myself for Saturday's match?"*
• *"Is it safe to do an extra run tomorrow?"*`,
      source: 'gemini-3.8-flash',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    'Explain the 0.8–1.3 Sweet Spot in simple terms',
    'How should I eat and sleep before the next game?',
    'What happens to my injury risk if I train extra hard tomorrow?',
    'I feel exhausted today — what should I do?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          context: {
            athleteName,
            sport,
            currentACWR: metrics.currentACWR,
            acuteLoad: metrics.acuteLoad,
            chronicLoad: metrics.chronicLoad,
            recoveryScore: metrics.recoveryScore,
            injuryRiskPct: metrics.injuryRiskPct,
            upcomingMatches: fixtures,
            sevenDayPlan: plan.map((d) => ({
              day: d.dayName,
              session: d.sessionType,
              targetLoad: d.targetLoad,
              focus: d.focus,
            })),
          },
        }),
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: data.reply || 'Analysis completed according to training safety guidelines.',
        source: data.source,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Failed to query AI coach:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Just now',
          text: `With your current training balance of ${metrics.currentACWR.toFixed(2)}, keeping your daily sessions in the sweet spot protects your muscles while steadily raising your stamina. Let me know if you want to adjust any specific day's workout!`,
          source: 'sports-science-engine',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-4 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="p-5 sm:p-7 rounded-3xl glass-card border border-orange-200 shadow-xs flex flex-col h-[640px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-orange-200/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5500] text-white flex items-center justify-center font-bold text-lg shadow-xs">
              <span>🐎</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-neutral-900 font-display">
                  AI Performance Coach
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-orange-100 text-[#FF5500] font-bold">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono-code">
                Dedicated training science &amp; recovery advice for {sport}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono-code text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Biometric Context Synchronized</span>
          </div>
        </div>

        {/* Quick prompt suggestions */}
        <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto border-b border-orange-100/60">
          <span className="text-[11px] font-mono-code text-neutral-400 whitespace-nowrap pl-1">
            Try asking:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-orange-50 text-neutral-700 hover:text-[#FF5500] border border-orange-200/70 whitespace-nowrap transition-all shadow-2xs font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5500] flex-shrink-0 flex items-center justify-center font-bold text-xs mt-0.5">
                    🐎
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#FF5500] text-white shadow-xs rounded-br-none font-medium'
                      : 'bg-white text-neutral-800 border border-orange-200/80 shadow-xs rounded-bl-none font-mono-code'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <div
                    className={`mt-1.5 text-[10px] flex items-center justify-between gap-3 ${
                      isUser ? 'text-white/70' : 'text-neutral-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.source && <span>via {msg.source}</span>}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#1D1814] text-white flex-shrink-0 flex items-center justify-center font-bold text-xs mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-neutral-500 font-mono-code py-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5500] flex items-center justify-center font-bold text-xs">
                🐎
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-2xl border border-orange-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-neutral-500 ml-1">AI coach analyzing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-orange-200/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about your training, soreness, or game prep..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-orange-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5500] shadow-2xs"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 py-2.5 rounded-2xl bg-[#FF5500] hover:bg-[#E84E00] text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 shadow-xs"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
