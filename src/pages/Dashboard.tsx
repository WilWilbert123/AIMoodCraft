import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJournalStore } from '@/store/journalStore';
import { useMoodStore } from '@/store/moodStore';
import { Card } from '@/components/ui/Card';
import { MoodTimeline } from '@/components/mood/MoodTimeline';
import { AIInsights } from '@/components/ai/AIInsights';
import { getUserStats } from '@/utils/moodCalculator';
import { MOOD_OPTIONS } from '@/utils/constants';
import { BookOpen, TrendingUp, CalendarDays, ArrowRight, Activity, Send, Sparkles, User, Bot } from 'lucide-react';
import { format, isSameDay, subDays } from 'date-fns';
import { generateAIResponseStream } from '@/utils/geminiClient';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { entries } = useJournalStore();
  const { moodHistory } = useMoodStore();
  const stats = getUserStats(moodHistory, entries);
  const latestMood = entries.length > 0 ? entries[0].mood : null;

  const [activePoint, setActivePoint] = useState<number | null>(null);

  // --- Real AI Chat State ---
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I'm here if you'd like to talk about your day or reflect on how you're feeling.",
      time: format(new Date(), 'h:mm a'),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Ref attached directly to the scrollable container instead of a bottom element
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll inside the chat container ONLY (prevents main window jump)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // --- Real AI Stream Handler ---
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: format(new Date(), 'h:mm a'),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Prepare full conversation history for Gemini API
    const history = updatedMessages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    // Create a temporary placeholder message for streaming
    const aiMsgId = (Date.now() + 1).toString();
    const aiMsgTime = format(new Date(), 'h:mm a');

    setMessages((prev) => [
      ...prev,
      { id: aiMsgId, sender: 'ai', text: '', time: aiMsgTime },
    ]);

    try {
      const responseStream = await generateAIResponseStream(history, latestMood);

      let accumulatedText = '';
      for await (const chunk of responseStream) {
        accumulatedText += chunk.text;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId ? { ...msg, text: accumulatedText } : msg
          )
        );
      }
    } catch (error) {
      console.error('Gemini AI API Error:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? {
                ...msg,
                text: "I'm having a little trouble connecting right now. Please check your network or API key.",
              }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  // --- Data Calculations ---
  const weekStart = subDays(new Date(), 6);
  const weekEntries = entries.filter((entry) => new Date(entry.createdAt) >= weekStart);
  const weekMoodCounts = weekEntries.reduce<Record<string, number>>((counts, entry) => {
    counts[entry.mood] = (counts[entry.mood] ?? 0) + 1;
    return counts;
  }, {});
  const weekMood = Object.entries(weekMoodCounts).sort(([, first], [, second]) => second - first)[0]?.[0];
  const weekMoodOption = MOOD_OPTIONS.find((mood) => mood.value === weekMood);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = subDays(new Date(), 6 - index);
      const entry = entries.find((item) => isSameDay(new Date(item.createdAt), date));
      let score = 0;
      if (entry) {
        const moodIdx = MOOD_OPTIONS.findIndex((m) => m.value === entry.mood);
        score = moodIdx !== -1 ? MOOD_OPTIONS.length - moodIdx : 4;
      }
      return { date, entry, score };
    });
  }, [entries]);

  // Compute SVG Points & Thin Cubic Bézier Curve
  const { chartPoints, pathD } = useMemo(() => {
    const width = 100;
    const height = 36;
    const paddingX = 6;
    const paddingY = 6;

    const points = weekDays.map((day, index) => {
      const x = paddingX + (index / 6) * (width - paddingX * 2);
      const rawScore = day.score > 0 ? day.score : 3.5;
      const y = height - paddingY - ((rawScore - 1) / 6) * (height - paddingY * 2);
      return {
        x,
        y,
        score: day.score,
        date: day.date,
        entry: day.entry,
        emoji: MOOD_OPTIONS.find((m) => m.value === day.entry?.mood)?.emoji,
        label: MOOD_OPTIONS.find((m) => m.value === day.entry?.mood)?.label,
      };
    });

    const getControlPoint = (current: any, previous: any, next: any, reverse = false) => {
      const p = previous || current;
      const n = next || current;
      const smoothing = 0.18;
      const lengthX = n.x - p.x;
      const lengthY = n.y - p.y;
      const angle = Math.atan2(lengthY, lengthX) + (reverse ? Math.PI : 0);
      const length = Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)) * smoothing;
      const cx = current.x + Math.cos(angle) * length;
      const cy = current.y + Math.sin(angle) * length;
      return { x: cx, y: cy };
    };

    const path = points.reduce((acc, point, i, arr) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const cp1 = getControlPoint(arr[i - 1], arr[i - 2], point);
      const cp2 = getControlPoint(point, arr[i - 1], arr[i + 1], true);
      return `${acc} C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${point.x},${point.y}`;
    }, '');

    return { chartPoints: points, pathD: path };
  }, [weekDays]);

  const statCards = [
    { icon: <BookOpen size={18} />, label: 'Journal entries', value: stats.totalEntries, accent: 'text-violet-600 bg-violet-100/80 dark:bg-violet-500/15 dark:text-violet-300' },
    { icon: <TrendingUp size={18} />, label: 'Average mood', value: stats.averageMood > 0 ? `${stats.averageMood}/7` : '—', accent: 'text-cyan-600 bg-cyan-100/80 dark:bg-cyan-500/15 dark:text-cyan-300' },
    { icon: <CalendarDays size={18} />, label: 'Current streak', value: `${stats.streakDays} days`, accent: 'text-amber-600 bg-amber-100/80 dark:bg-amber-500/15 dark:text-amber-300' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section & AI Chat Grid */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Side: Check-in Hero Box */}
        <div className="relative flex flex-col items-center justify-center text-center overflow-hidden rounded-[32px] border border-black/10 bg-white p-6 text-neutral-950 shadow-[0_28px_80px_-28px_rgba(0,0,0,0.28)] dark:border-white/10 dark:bg-neutral-950 dark:text-white sm:p-8 lg:col-span-7">
          <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/20" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/15" />
          
          <div className="relative flex flex-col items-center max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300">
              Your private reflection space
            </div>
            <p className="text-sm font-medium text-neutral-600 dark:text-white/75">Today’s check-in</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
              How are you feeling today?
            </h1>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-white/75 sm:text-base">
              Choose a feeling to begin a thoughtful entry. Every small check-in helps reveal your bigger picture.
            </p>

            {/* Mood Options Grid */}
            <div className="mt-6 grid grid-cols-4 gap-2.5 sm:flex sm:flex-wrap sm:justify-center">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => navigate(`/journal?new=1&mood=${mood.value}`)}
                  className="group flex min-h-14 flex-col items-center justify-center rounded-2xl border border-black/10 bg-black/[0.04] p-2 text-neutral-950 transition duration-200 hover:-translate-y-0.5 hover:bg-black/[0.08] hover:shadow-md dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 sm:w-16"
                  aria-label={`Start a ${mood.label.toLowerCase()} journal entry`}
                >
                  <span className="text-2xl transition-transform duration-200 group-hover:scale-110">{mood.emoji}</span>
                  <span className="mt-1 text-[11px] font-medium leading-tight">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Real AI Streaming Chat Box */}
        <div className="relative flex h-[460px] flex-col overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_28px_80px_-28px_rgba(0,0,0,0.28)] dark:border-white/10 dark:bg-neutral-950 lg:col-span-5">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-black/5 bg-neutral-50/50 px-5 py-4 dark:border-white/5 dark:bg-neutral-900/40">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-950 dark:text-white">Reflect with AI</h3>
                <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Powered by Gemini AI</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Live AI
            </span>
          </div>

          {/* Messages Area - attached ref here to isolate scrolling */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs ${
                    msg.sender === 'user'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                      : 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300'
                  }`}
                >
                  {msg.sender === 'user' ? <User size={13} /> : <Bot size={13} />}
                </div>

                <div className={`max-w-[80%] space-y-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`inline-block rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                        : 'border border-black/5 bg-neutral-100/80 text-neutral-800 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-200'
                    }`}
                  >
                    {msg.text || <span className="animate-pulse">...</span>}
                  </div>
                  <p className="text-[10px] text-neutral-400 px-1">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          {messages.length < 3 && (
            <div className="flex items-center gap-1.5 overflow-x-auto px-4 pb-2 text-[11px] scrollbar-none">
              <button
                type="button"
                onClick={() => handleSendMessage("Help me untangle my thoughts today")}
                className="shrink-0 rounded-full border border-black/10 bg-neutral-50 px-2.5 py-1 text-neutral-600 transition hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                💭 Untangle thoughts
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage("I need a quick grounding exercise")}
                className="shrink-0 rounded-full border border-black/10 bg-neutral-50 px-2.5 py-1 text-neutral-600 transition hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                🌿 Grounding exercise
              </button>
            </div>
          )}

          {/* Chat Input */}
          <div className="shrink-0 border-t border-black/5 p-3 dark:border-white/5 bg-white dark:bg-neutral-950">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Talk to AI..."
                className="flex-1 rounded-xl border border-black/10 bg-neutral-50 px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-violet-500 focus:bg-white dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500 dark:focus:border-violet-400 dark:focus:bg-neutral-900"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="grid h-8 w-8 place-items-center rounded-xl bg-neutral-950 text-white transition hover:bg-neutral-800 disabled:opacity-40 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stat Cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-4 sm:p-5" hover>
            <div className="flex items-center gap-3">
              <span className={`grid h-11 w-11 place-items-center rounded-2xl ${stat.accent}`}>{stat.icon}</span>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </section>

      {/* Timeline + Insights */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3" padding="lg">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-500">Your rhythm</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Recent mood check-ins</h2>
            </div>
            <button type="button" onClick={() => navigate('/insights')} className="inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-sm font-semibold text-violet-600 transition hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-500/10">
              Insights <ArrowRight size={16} />
            </button>
          </div>
          <MoodTimeline moodData={moodHistory.slice(0, 5)} limit={5} />
        </Card>

        <Card className="lg:col-span-2" padding="lg">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-300">Gentle guidance</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">A moment for you</h2>
          </div>
          <AIInsights entries={entries} />
        </Card>
      </section>

      {/* Weekly Review + Monochrome Line Graph */}
      <section className="overflow-hidden rounded-[32px] border border-black/10 bg-white p-5 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.22)] dark:border-white/10 dark:bg-neutral-950 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">Your week in review</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">Small moments, clearer patterns.</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {weekEntries.length === 0
                ? 'Start with one check-in today and your weekly rhythm will begin to take shape.'
                : `You captured ${weekEntries.length} ${weekEntries.length === 1 ? 'moment' : 'moments'} this week${weekMoodOption ? `, with ${weekMoodOption.label.toLowerCase()} appearing most often` : ''}.`}
            </p>
          </div>
          <button type="button" onClick={() => navigate('/insights')} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-black/10 bg-neutral-950 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:border-white/15 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 dark:focus:ring-white dark:focus:ring-offset-neutral-950">
            Explore insights <ArrowRight size={16} />
          </button>
        </div>

        {/* Minimal Black & White Line Container */}
        <div className="relative mt-7 rounded-3xl border border-neutral-200/80 bg-neutral-50/50 p-5 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/40">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-neutral-200/60 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
                <Activity size={15} />
              </span>
              <span className="text-xs font-semibold tracking-wide text-neutral-800 dark:text-neutral-200">7-DAY MOOD TRAJECTORY</span>
            </div>
            {activePoint !== null && chartPoints[activePoint]?.entry && (
              <div className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-800 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                <span>{chartPoints[activePoint].emoji}</span>
                <span>{chartPoints[activePoint].label}</span>
                <span className="text-neutral-400">•</span>
                <span className="text-neutral-900 dark:text-neutral-100">{format(chartPoints[activePoint].date, 'MMM d')}</span>
              </div>
            )}
          </div>

          <div className="relative h-16 w-full">
            <svg className="h-full w-full overflow-visible" viewBox="0 0 100 36" preserveAspectRatio="none">
              <path
                d={pathD}
                fill="none"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-neutral-900 dark:stroke-white"
              />

              {chartPoints.map((pt, i) => (
                <g key={i} className="cursor-pointer" onMouseEnter={() => setActivePoint(i)} onMouseLeave={() => setActivePoint(null)}>
                  {activePoint === i && (
                    <line
                      x1={pt.x}
                      y1="0"
                      x2={pt.x}
                      y2="36"
                      strokeWidth="0.8"
                      strokeDasharray="1.5 1.5"
                      className="stroke-neutral-900/40 dark:stroke-white/40"
                    />
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Day Grid Bar */}
        <div className="mt-5 grid grid-cols-7 gap-2 sm:gap-3">
          {weekDays.map(({ date, entry }, idx) => (
            <div
              key={date.toISOString()}
              onMouseEnter={() => setActivePoint(idx)}
              onMouseLeave={() => setActivePoint(null)}
              className={`group min-w-0 cursor-pointer rounded-2xl p-2 text-center transition-colors duration-150 ${activePoint === idx ? 'bg-neutral-100 dark:bg-neutral-800/60' : ''}`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">{format(date, 'EEE')}</p>
              <div
                className={`mx-auto mt-2 grid h-10 w-10 place-items-center rounded-2xl border text-lg transition-transform duration-200 group-hover:scale-105 sm:h-12 sm:w-12 sm:text-xl ${
                  entry
                    ? 'border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900'
                    : 'border-dashed border-neutral-300 bg-neutral-50 text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900/40 dark:text-neutral-600'
                }`}
                title={entry ? `${entry.mood} entry` : 'No entry'}
              >
                {entry ? MOOD_OPTIONS.find((mood) => mood.value === entry.mood)?.emoji : '—'}
              </div>
              <p className="mt-2 truncate text-[11px] font-medium text-neutral-600 dark:text-neutral-300">{format(date, 'd')}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};