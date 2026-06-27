import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, FileText, Briefcase, UserCheck, MessageSquare, Github, BarChart2,
  ArrowRight, ChevronDown,
} from 'lucide-react'
import { MarketingLayout } from '../components/marketing/MarketingLayout'
import { Button, Card, Badge } from '../components/ui'

const FEATURES = [
  { icon: FileText, title: 'Resume Lab', desc: 'ATS scoring, keyword extraction, and actionable optimization recommendations in seconds.', color: 'from-indigo-500/20 to-indigo-500/5' },
  { icon: Briefcase, title: 'Job Matching', desc: 'Paste any job description and get a precise skills gap analysis with match scoring.', color: 'from-emerald-500/20 to-emerald-500/5' },
  { icon: UserCheck, title: 'AI Recruiter', desc: 'Simulate how a senior recruiter at a top company actually reads your resume.', color: 'from-amber-500/20 to-amber-500/5' },
  { icon: MessageSquare, title: 'Interview Prep', desc: 'Auto-generated technical, behavioral, and project questions tailored to the role.', color: 'from-blue-500/20 to-blue-500/5' },
  { icon: Github, title: 'Portfolio Analyzer', desc: 'Connect GitHub to score project quality, language diversity, and internship readiness.', color: 'from-slate-500/20 to-slate-500/5' },
  { icon: BarChart2, title: 'Career Analytics', desc: 'Track ATS scores, match rates, and interview readiness trends over time.', color: 'from-purple-500/20 to-purple-500/5' },
]



const FAQ = [
  { q: 'Is CareerIQ free?', a: 'Yes! CareerIQ is free during beta. Upload your resume and run analyses at no cost.' },
  { q: 'Do I need an OpenAI API key?', a: 'No. The platform works out of the box with intelligent mock data when no API key is configured.' },
  { q: 'What file formats are supported?', a: 'PDF, DOCX, and TXT resumes up to 5MB.' },
  { q: 'Is my data secure?', a: 'Your resumes and analyses are stored securely and never shared with third parties.' },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export default function Landing() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-20 text-center">
        <motion.div {...fadeUp}>
          <Badge variant="indigo" size="md" className="mb-6">
            <Zap size={11} className="mr-1.5" /> AI-powered career intelligence
          </Badge>
        </motion.div>

        <motion.h1
          {...fadeUp}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6"
        >
          The career platform
          <br />
          <span className="gradient-text">that tells you the truth.</span>
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Analyze resumes, match jobs, simulate recruiters, and track growth — all in one AI-driven platform built for candidates who want real feedback.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link to="/register">
            <Button size="lg" iconRight={<ArrowRight size={16} />}>Start for free</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">Demo access</Button>
          </Link>
        </motion.div>

      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Everything you need to land the role.
          </h2>
          <p className="text-slate-400 text-lg">Six tools. One platform. Zero fluff.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} {...fadeUp} transition={{ delay: i * 0.08 }}>
              <Card hover className={`h-full bg-gradient-to-br ${f.color}`}>
                <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-indigo-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>



      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">FAQ</h2>
        </motion.div>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <motion.details key={item.q} {...fadeUp} transition={{ delay: i * 0.05 }} className="group">
              <Card padding="md" className="cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-sm list-none">
                  {item.q}
                  <ChevronDown size={16} className="text-slate-500 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed">{item.a}</p>
              </Card>
            </motion.details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div {...fadeUp} className="rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-surface-2" />
          <div className="relative p-12 sm:p-16 text-center border border-indigo-500/20 rounded-3xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Start improving your candidacy today.
            </h2>
            <p className="text-slate-400 mb-8 text-lg">Free to start. No credit card required.</p>
            <Link to="/register">
              <Button size="lg" iconRight={<ArrowRight size={16} />}>Create free account</Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </MarketingLayout>
  )
}
