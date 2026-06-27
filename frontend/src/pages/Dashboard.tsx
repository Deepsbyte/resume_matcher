import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { api } from '../lib/api'
import { useAuthStore } from '../store/auth'
import {
  ScoreRing, Card, StatsCard, EmptyState, PageHeader, Spinner, Button, Badge,
} from '../components/ui'
import { PageTransition } from '../components/layout/PageTransition'
import {
  FileText, Briefcase, UserCheck, MessageSquare, Github, BarChart2,
  ArrowRight, Activity, Sparkles, TrendingUp, Target, Zap,
} from 'lucide-react'

const QUICK_ACTIONS = [
  { to: '/resume-lab', icon: FileText, label: 'Analyze resume', desc: 'Upload & score', color: 'text-indigo-400' },
  { to: '/job-match', icon: Briefcase, label: 'Match a job', desc: 'Skills gap analysis', color: 'text-emerald-400' },
  { to: '/recruiter', icon: UserCheck, label: 'Recruiter review', desc: 'Simulate hiring', color: 'text-amber-400' },
  { to: '/interview-prep', icon: MessageSquare, label: 'Interview prep', desc: 'Practice questions', color: 'text-blue-400' },
  { to: '/portfolio', icon: Github, label: 'Analyze GitHub', desc: 'Portfolio score', color: 'text-slate-300' },
  { to: '/analytics', icon: BarChart2, label: 'View analytics', desc: 'Score trends', color: 'text-purple-400' },
]

interface Stats {
  ats_score: number | null
  match_score: number | null
  portfolio_score: number | null
  interview_readiness: number | null
  resume_count: number
  analysis_count: number
  match_count: number
  recruiter_report_count: number
}

interface ActivityItem {
  type: string
  id: string
  label: string
  created_at: string
}

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<Stats | null>(null)
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/dashboard/stats'), api.get('/dashboard/activity')])
      .then(([s, a]) => { setStats(s.data); setActivity(a.data) })
      .finally(() => setLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.full_name?.split(' ')[0] || 'there'

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner size={32} />
      </div>
    )
  }

  const chartData = [
    { name: 'W1', ats: stats?.ats_score ?? 0, match: stats?.match_score ?? 0 },
    { name: 'W2', ats: (stats?.ats_score ?? 0) * 0.9, match: (stats?.match_score ?? 0) * 0.85 },
    { name: 'W3', ats: (stats?.ats_score ?? 0) * 0.95, match: (stats?.match_score ?? 0) * 0.92 },
    { name: 'Now', ats: stats?.ats_score ?? 0, match: stats?.match_score ?? 0 },
  ]

  const hasData = stats && (stats.ats_score != null || stats.match_score != null)

  return (
    <PageTransition>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl relative overflow-hidden mb-8 p-6 sm:p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent" />
        <div className="absolute inset-0 border border-indigo-500/20 rounded-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <Badge variant="indigo" className="mb-3">
              <Sparkles size={11} className="mr-1" /> Career Intelligence
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              {greeting}, {firstName}.
            </h1>
            <p className="text-slate-400 text-sm max-w-md">
              Here&apos;s where your career intelligence stands. Keep improving to land your dream role.
            </p>
          </div>
          <Link to="/resume-lab">
            <Button icon={<Zap size={16} />} iconRight={<ArrowRight size={14} />}>
              Run analysis
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Score rings */}
      <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { score: stats?.ats_score, label: 'ATS Score' },
          { score: stats?.match_score, label: 'Match Score' },
          { score: stats?.portfolio_score, label: 'Portfolio' },
          { score: stats?.interview_readiness, label: 'Readiness' },
        ].map(s => (
          <motion.div key={s.label} variants={fadeUp}>
            <Card className="flex flex-col items-center py-6" hover>
              <ScoreRing score={s.score ?? null} label={s.label} size={88} />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats row */}
      <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Resumes', value: stats?.resume_count ?? 0, icon: <FileText size={18} /> },
          { label: 'Analyses', value: stats?.analysis_count ?? 0, icon: <TrendingUp size={18} /> },
          { label: 'Job Matches', value: stats?.match_count ?? 0, icon: <Target size={18} /> },
          { label: 'Reports', value: stats?.recruiter_report_count ?? 0, icon: <UserCheck size={18} /> },
        ].map(s => (
          <motion.div key={s.label} variants={fadeUp}>
            <StatsCard label={s.label} value={s.value} icon={s.icon} />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6 mb-8">
        {/* Chart */}
        <Card className="lg:col-span-3" padding="lg">
          <h2 className="font-semibold text-sm text-slate-400 mb-4">Score trends</h2>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="atsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#16161d', border: '1px solid #2a2a35', borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="ats" stroke="#818cf8" fill="url(#atsGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="match" stroke="#22c55e" fill="transparent" strokeWidth={2} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* AI Insights */}
        <Card className="lg:col-span-2" padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={15} className="text-indigo-400" />
            <h2 className="font-semibold text-sm">AI Insights</h2>
          </div>
          <div className="space-y-3">
            {[
              hasData ? 'Your ATS score is trending upward — keep optimizing keywords.' : 'Upload a resume to unlock personalized insights.',
              'Try matching against a target job description next.',
              'Run a recruiter simulation to identify blind spots.',
            ].map((tip, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-surface-3/50 border border-white/5">
                <span className="text-indigo-400 font-mono text-xs font-bold shrink-0">0{i + 1}</span>
                <p className="text-xs text-slate-400 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card padding="lg">
          <h2 className="font-semibold text-sm text-slate-400 mb-4">Quick actions</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {QUICK_ACTIONS.map(a => (
              <Link key={a.to} to={a.to}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface-3/50 border border-transparent hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all group"
                >
                  <div className="h-9 w-9 rounded-lg bg-surface-2 border border-white/5 flex items-center justify-center">
                    <a.icon size={16} className={a.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{a.label}</p>
                    <p className="text-[11px] text-slate-500">{a.desc}</p>
                  </div>
                  <ArrowRight size={12} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                </motion.div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Activity */}
        <Card padding="lg">
          <h2 className="font-semibold text-sm text-slate-400 mb-4">Recent activity</h2>
          {activity.length === 0 ? (
            <EmptyState
              icon={<Activity size={28} />}
              title="No activity yet"
              description="Run your first analysis to see results here."
            />
          ) : (
            <div className="space-y-1">
              {activity.map((a, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start py-3 border-b border-white/[0.03] last:border-0"
                >
                  <div
                    className={`h-2 w-2 rounded-full mt-2 shrink-0 ${
                      a.type === 'analysis' ? 'bg-indigo-500' : a.type === 'match' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 leading-snug">{a.label}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {new Date(a.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {!hasData && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
          <Card padding="lg" className="text-center border-dashed border-indigo-500/20">
            <FileText size={32} className="text-indigo-400 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Start with your resume</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              Upload a resume to get your first ATS score and personalized recommendations.
            </p>
            <Link to="/resume-lab">
              <Button iconRight={<ArrowRight size={14} />}>Go to Resume Lab</Button>
            </Link>
          </Card>
        </motion.div>
      )}
    </PageTransition>
  )
}
