'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Users,
  Bot,
  TrendingUp,
  ArrowLeft,
  Globe,
  GitBranch,
  Code,
  BarChart3,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/store/chat-store';
import { AI_MODELS } from '@/lib/models';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import type { PieLabelRenderProps } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#f97316'];

function StatCard({ title, value, icon: Icon, color, sub }: {
  title: string; value: string | number; icon: typeof MessageSquare; color: string; sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-5 hover:border-primary/50 transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{title}</span>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      <div className="text-3xl font-bold">{value}</div>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const { conversations, personas } = useChatStore();

  useEffect(() => { setMounted(true); }, []);

  const analytics = useMemo(() => {
    if (!conversations.length) return null;

    const allMessages = conversations.flatMap(c => c.messages);
    const userMessages = allMessages.filter(m => m.role === 'user');
    const assistantMessages = allMessages.filter(m => m.role === 'assistant');

    // Model usage
    const modelCount: Record<string, number> = {};
    conversations.forEach(c => {
      const name = AI_MODELS.find(m => m.id === c.model)?.name || c.model.split('/').pop() || 'Unknown';
      modelCount[name] = (modelCount[name] || 0) + 1;
    });
    const modelData = Object.entries(modelCount)
      .map(([name, value]) => ({ name: name.length > 20 ? name.slice(0, 18) + '..' : name, value }))
      .sort((a, b) => b.value - a.value);

    // Persona usage
    const personaCount: Record<string, number> = {};
    conversations.forEach(c => {
      const p = personas.find(p => p.id === c.persona);
      const name = p?.name || 'Nexus';
      personaCount[name] = (personaCount[name] || 0) + 1;
    });
    const personaData = Object.entries(personaCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Activity over last 30 days
    const now = new Date();
    const activityMap: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      activityMap[key] = 0;
    }
    allMessages.forEach(m => {
      const key = new Date(m.createdAt).toISOString().split('T')[0];
      if (activityMap[key] !== undefined) {
        activityMap[key]++;
      }
    });
    const activityData = Object.entries(activityMap).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      messages: count,
    }));

    // Feature usage
    const webSearchUsed = assistantMessages.filter(m => m.sources && m.sources.length > 0).length;
    const branchedConvos = conversations.filter(c => c.parentId).length;
    const codeMessages = assistantMessages.filter(m => m.content.includes('```')).length;

    // Top conversations
    const topConvos = [...conversations]
      .sort((a, b) => b.messages.length - a.messages.length)
      .slice(0, 5)
      .map(c => ({ name: c.title.length > 30 ? c.title.slice(0, 28) + '..' : c.title, messages: c.messages.length }));

    return {
      totalConversations: conversations.length,
      totalMessages: allMessages.length,
      totalUserMessages: userMessages.length,
      totalAssistantMessages: assistantMessages.length,
      avgMessagesPerChat: conversations.length ? Math.round(allMessages.length / conversations.length) : 0,
      modelData,
      personaData,
      activityData,
      webSearchUsed,
      branchedConvos,
      codeMessages,
      topConvos,
    };
  }, [conversations, personas]);

  if (!mounted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to NEXUS AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="NEXUS AI" className="h-8 w-8" />
            <span className="font-semibold">Analytics</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <Badge variant="outline" className="px-4 py-1 mb-4">
            <BarChart3 className="h-3 w-3 mr-1" />
            Usage Analytics
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Your Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Track your NEXUS AI usage and insights</p>
        </motion.div>

        {!analytics || analytics.totalConversations === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No data yet</p>
            <p className="text-sm mt-1">Start chatting to see your analytics!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Chats" value={analytics.totalConversations} icon={MessageSquare} color="bg-indigo-500" />
              <StatCard title="Total Messages" value={analytics.totalMessages} icon={TrendingUp} color="bg-purple-500" sub={`${analytics.totalUserMessages} sent, ${analytics.totalAssistantMessages} received`} />
              <StatCard title="AI Responses" value={analytics.totalAssistantMessages} icon={Bot} color="bg-pink-500" />
              <StatCard title="Avg per Chat" value={analytics.avgMessagesPerChat} icon={Activity} color="bg-emerald-500" sub="messages per conversation" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Model Usage Pie */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" /> Model Usage
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={analytics.modelData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={(props: PieLabelRenderProps) => `${props.name ?? ''} ${(((props.percent as number) ?? 0) * 100).toFixed(0)}%`}>
                      {analytics.modelData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Persona Usage Bar */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Persona Usage
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analytics.personaData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <RechartsTooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {analytics.personaData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Activity Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Activity (Last 30 Days)
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={analytics.activityData}>
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} interval={4} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <RechartsTooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="messages" stroke="#6366f1" strokeWidth={2} fill="url(#gradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Feature Usage */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" /> Feature Usage
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-blue-500" />
                      <span>Web Search</span>
                    </div>
                    <Badge variant="secondary">{analytics.webSearchUsed} uses</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <GitBranch className="h-5 w-5 text-green-500" />
                      <span>Branched Conversations</span>
                    </div>
                    <Badge variant="secondary">{analytics.branchedConvos}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Code className="h-5 w-5 text-purple-500" />
                      <span>Code Responses</span>
                    </div>
                    <Badge variant="secondary">{analytics.codeMessages}</Badge>
                  </div>
                </div>
              </motion.div>

              {/* Top Conversations */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" /> Top Conversations
                </h3>
                <div className="space-y-3">
                  {analytics.topConvos.map((convo, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-primary w-5">#{i + 1}</span>
                        <span className="text-sm truncate">{convo.name}</span>
                      </div>
                      <Badge variant="secondary">{convo.messages} msgs</Badge>
                    </div>
                  ))}
                  {analytics.topConvos.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No conversations yet</p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        Made with ❤️ by <a href="https://github.com/nitijkumar424-arch" className="text-primary hover:underline">Nitij Kumar</a>
      </footer>
    </div>
  );
}
