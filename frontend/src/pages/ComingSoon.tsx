import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap } from 'lucide-react'
import { MarketingLayout } from '../components/marketing/MarketingLayout'
import { Button, Card, Badge } from '../components/ui'

export default function ComingSoon() {
  return (
    <MarketingLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-center">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-glow">
              <Zap size={20} className="text-white" />
            </div>
          </div>

          <Badge variant="indigo" className="mx-auto">Coming Soon</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
            This page is under construction.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            We’re actively building this section. In the meantime, you can explore what’s available now.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link to="/features">
              <Button size="lg" iconRight={<ArrowRight size={16} />}>View features</Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline">Create free account</Button>
            </Link>
          </div>

          <Card padding="lg" className="bg-white/5 border-white/10">
            <p className="text-sm text-slate-300">
              Tip: Use the footer links above to quickly find what you need—unfinished links will route here.
            </p>
          </Card>
        </motion.div>
      </div>
    </MarketingLayout>
  )
}

