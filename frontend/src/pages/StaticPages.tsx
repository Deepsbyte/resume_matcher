import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, FileText, Briefcase, UserCheck, MessageSquare, Github, BarChart2,
  ArrowRight, Check,
} from 'lucide-react'
import { MarketingLayout } from '../components/marketing/MarketingLayout'
import { Button, Card, Badge } from '../components/ui'

const FEATURES = [
  { icon: FileText, title: 'Resume Lab', color: 'text-indigo-400', desc: 'ATS scoring across 12 dimensions. Keyword extraction, skill identification, and tailored recommendations — in under 15 seconds.', bullets: ['ATS score 0–100', 'Skills & keyword extraction', 'Strength/weakness breakdown', 'Actionable recommendations'] },
  { icon: Briefcase, title: 'Job Match', color: 'text-emerald-400', desc: 'Paste any job description and get a precise skills gap analysis showing exactly what you\'re missing.', bullets: ['Overall match score', 'Skill match breakdown', 'Missing keywords & tech', 'Recommendations to close the gap'] },
  { icon: UserCheck, title: 'AI Recruiter', color: 'text-amber-400', desc: 'Simulate a senior recruiter\'s first-pass review. Brutally honest. No validation.', bullets: ['Shortlist probability', 'Hiring recommendation', 'Risk factors identified', 'Questions they\'d ask you'] },
  { icon: MessageSquare, title: 'Interview Prep', color: 'text-blue-400', desc: 'Role-tailored questions across technical, behavioral, and project categories — with model answers.', bullets: ['Technical questions', 'Behavioral questions', 'Project-specific questions', 'Evaluation criteria per question'] },
  { icon: Github, title: 'Portfolio Analyzer', color: 'text-slate-300', desc: 'Connect your GitHub to score project quality, language diversity, and overall internship readiness.', bullets: ['Portfolio score 0–100', 'Language breakdown', 'Internship readiness rating', 'Improvement suggestions'] },
  { icon: BarChart2, title: 'Analytics', color: 'text-red-400', desc: 'Track ATS scores, match rates, and readiness trends over every session.', bullets: ['ATS score over time', 'Job match trend', 'Portfolio growth tracking', 'Interview readiness trend'] },
]

export function FeaturesPage() {
  return (
    <MarketingLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge variant="indigo" className="mb-4">Platform</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Six tools. One mission.
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Everything you need to understand where you stand and what to fix.
          </p>
        </motion.div>

        <div className="space-y-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card hover className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <f.icon size={18} className={f.color} />
                    </div>
                    <h2 className="font-bold text-xl">{f.title}</h2>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
                <div className="lg:w-64 shrink-0">
                  <ul className="space-y-2.5">
                    {f.bullets.map(b => (
                      <li key={b} className="flex gap-2.5 text-sm text-slate-300">
                        <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/register">
            <Button size="lg" iconRight={<ArrowRight size={16} />}>Try all features free</Button>
          </Link>
        </div>
      </div>
    </MarketingLayout>
  )
}

export function PricingPage() {
  const plans = [
    { name: 'Free', price: '$0', period: 'forever', popular: false, features: ['5 resume analyses / month', '3 job matches / month', '1 recruiter review / month', 'Basic analytics', 'Community support'] },
    { name: 'Pro', price: '$12', period: 'per month', popular: true, features: ['Unlimited analyses', 'Unlimited job matches', 'Unlimited recruiter reviews', 'Interview prep sessions', 'Portfolio analyzer', 'Advanced analytics', 'PDF report export', 'Priority support'] },
    { name: 'Teams', price: '$49', period: 'per month', popular: false, features: ['Everything in Pro', 'Up to 10 members', 'Shared analytics', 'Admin dashboard', 'Custom branding', 'Dedicated support'] },
  ]

  return (
    <MarketingLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <Badge variant="indigo" className="mb-4">Pricing</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-slate-400 text-lg">Start free. Upgrade when you need more firepower.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className={`h-full relative ${p.popular ? 'border-indigo-500/40 shadow-glow' : ''}`}
                padding="lg"
              >
                {p.popular && (
                  <Badge variant="indigo" className="absolute -top-3 left-1/2 -translate-x-1/2">
                    MOST POPULAR
                  </Badge>
                )}
                <h3 className="font-bold text-lg mb-2">{p.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold tracking-tight">{p.price}</span>
                  <span className="text-slate-500 text-sm ml-1">/ {p.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {p.features.map(f => (
                    <li key={f} className="flex gap-2 text-sm text-slate-300">
                      <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="block">
                  <Button variant={p.popular ? 'primary' : 'secondary'} fullWidth>
                    Get started
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-slate-500 mt-10">
          Pricing is illustrative. CareerIQ is currently free during beta.
        </p>
      </div>
    </MarketingLayout>
  )
}
