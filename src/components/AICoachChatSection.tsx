import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
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
  const athleteName = profile?.name || 'Athlete';
  const sport = profile?.sport || 'Soccer';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      timestamp: 'Now',
      text: `Greetings ${athleteName}. Neural link established.

I am your AI Sports Scientist and High-Performance Coach for ${sport}. 
Current live telemetry:
• **Training Balance (ACWR)**: **${metrics.currentACWR.toFixed(2)}** (${
        metrics.acwrStatus === 'sweet-spot' ? '🟢 Safe Sweet Spot' : '⚠️ Elevated Strain'
      })
• **Body Battery / Recovery**: **${metrics.recoveryScore}%**
• **Acute Effort**: **${metrics.acuteLoad} AU/day**

How can I assist your preparation today? Tap a quick question below or ask freely about fatigue, hamstrings, nutrition, or match tapering.`,
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
    'How should I taper before the next competition?',
    'What happens to my injury risk if I train extra hard tomorrow?',
    'I feel exhausted today — what should my workout be?',
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
        text: data.reply || 'Neural communications error. Please verify telemetry link and retry.',
        source: data.source || 'gemini-3.8-flash',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Now',
          text: 'Telemetry uplink interrupted. Please check network connection.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Top Uplink Status Ribbon */}
      <div className="p-4 sm:p-5 rounded-2xl neural-card border border-cyan-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-bold text-white">
                Neural Sports Scientist // Uplink
              </h2>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <p className="text-xs text-slate-400">
              Direct intelligence grounded in Tim Gabbett ACWR & periodization principles
            </p>
          </div>
        </div>

        {/* Live Context Telemetry Pills */}
        <div className="flex flex-wrap items-center gap-2 font-mono-code text-[11px]">
          <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-cyan-500/30 text-cyan-300">
            ACWR: <strong>{metrics.currentACWR.toFixed(2)}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-indigo-500/30 text-indigo-300">
            Acute: <strong>{metrics.acuteLoad} AU</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-emerald-500/30 text-emerald-300">
            Recovery: <strong>{metrics.recoveryScore}%</strong>
          </span>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="rounded-2xl neural-card border border-cyan-500/25 flex flex-col h-[560px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isBot
                      ? 'bg-cyan-950 border border-cyan-400/50 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                      : 'bg-indigo-950 border border-indigo-500/50 text-indigo-300'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line border ${
                    isBot
                      ? 'bg-[#090D18]/90 text-slate-100 border-cyan-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                      : 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-medium border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  }`}
                >
                  {msg.text}

                  {isBot && (
                    <div className="mt-2 pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[10px] font-mono-code text-slate-400">
                      <span>Coach Marcus • Sports Science AI</span>
                      <span>{msg.timestamp}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-lg mr-auto">
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#090D18] border border-cyan-500/30 text-cyan-300 font-mono-code text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Synthesizing response from current biometrics & Gabbett model...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompt Chips */}
        <div className="p-3 bg-black/40 border-t border-cyan-500/20 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-mono-code text-slate-400 uppercase shrink-0">
            Prompts:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl border border-cyan-500/20 bg-slate-950/60 hover:bg-cyan-950/60 hover:border-cyan-400/50 text-[11px] text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-3 sm:p-4 bg-[#070A12] border-t border-cyan-500/20 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask your coach anything about workload, taper, or recovery..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-slate-950/80 border border-cyan-500/30 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-medium"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
