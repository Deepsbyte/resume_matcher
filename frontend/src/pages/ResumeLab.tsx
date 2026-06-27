import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../lib/api'
import {
  Button, Card, PageHeader, Badge, ProgressBar, Spinner,
  FileUpload, ScoreRing, StepIndicator,
} from '../components/ui'
import { PageTransition } from '../components/layout/PageTransition'
import {
  FileText, CheckCircle, AlertCircle, RotateCcw, Star, TrendingUp,
  AlertTriangle,
} from 'lucide-react'
import toast from 'react-hot-toast'

type Step = 'upload' | 'processing' | 'result' | 'error'

interface Analysis {
  id: string
  ats_score: number
  skills: string[]
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  education: { degree: string; institution: string; year: string }[]
  experience: { title: string; company: string; duration: string; highlights: string[] }[]
  keywords: string[]
}

export default function ResumeLab() {
  const [step, setStep] = useState<Step>('upload')
  const [filename, setFilename] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0]
    if (!file) return
    setFilename(file.name)
    setSelectedFile(file)
    setStep('processing')
    setProgress(20)

    const fd = new FormData()
    fd.append('file', file)
    try {
      const { data: resume } = await api.post('/resumes/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setProgress(60)
      const { data: anal } = await api.post(`/resumes/${resume.id}/analyze`)
      setProgress(100)
      setAnalysis(anal)
      setStep('result')
    } catch {
      toast.error('Failed to analyze resume')
      setStep('error')
    }
  }, [])

  const reset = () => {
    setStep('upload')
    setAnalysis(null)
    setSelectedFile(null)
    setProgress(0)
    setFilename('')
  }

  const scoreVariant = (s: number) => (s >= 75 ? 'green' : s >= 50 ? 'yellow' : 'red') as 'green' | 'yellow' | 'red'
  const stepIndex = { upload: 0, processing: 1, result: 2, error: 1 }[step]

  return (
    <PageTransition>
      <PageHeader
        title="Resume Lab"
        subtitle="Upload your resume for ATS scoring, keyword analysis, and actionable recommendations."
        action={
          step !== 'upload' ? (
            <Button variant="ghost" size="sm" icon={<RotateCcw size={14} />} onClick={reset}>
              New analysis
            </Button>
          ) : undefined
        }
      />

      {step !== 'result' && (
        <StepIndicator
          steps={['Upload', 'Process', 'Results']}
          current={stepIndex}
        />
      )}

      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="max-w-xl mx-auto"
          >
            <FileUpload onDrop={onDrop} />

            <Card padding="md" className="mt-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                What gets analyzed
              </p>
              <div className="flex flex-wrap gap-2">
                {['ATS Score', 'Skills', 'Education', 'Experience', 'Keywords', 'Strengths', 'Weaknesses', 'Recommendations'].map(t => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md mx-auto text-center py-16"
          >
            <div className="h-20 w-20 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-6">
              <Spinner size={32} />
            </div>
            <h2 className="font-bold text-xl mb-2">Analyzing {filename}</h2>
            <p className="text-slate-400 text-sm mb-8">
              Running ATS scoring, extracting keywords, identifying gaps...
            </p>
            <ProgressBar value={progress} showLabel color="bg-indigo-500" size="md" />
          </motion.div>
        )}

        {step === 'error' && (
          <motion.div key="error" className="max-w-md mx-auto text-center py-16">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h2 className="font-bold text-xl mb-2">Analysis failed</h2>
            <p className="text-slate-400 text-sm mb-6">
              Something went wrong. Check that the backend is running and try again.
            </p>
            <Button onClick={reset} icon={<RotateCcw size={14} />}>Try again</Button>
          </motion.div>
        )}

        {step === 'result' && analysis && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Score header */}
            <Card padding="lg" className="gradient-border">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                    <FileText size={24} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{filename || selectedFile?.name}</p>
                    <p className="text-sm text-slate-500">Analysis complete</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <ScoreRing score={analysis.ats_score} label="ATS Score" size={110} />
                  <Badge color={scoreVariant(analysis.ats_score)} size="md">
                    {analysis.ats_score >= 75 ? 'Good' : analysis.ats_score >= 50 ? 'Needs work' : 'Critical'}
                  </Badge>
                </div>
              </div>
              <div className="mt-6">
                <ProgressBar
                  value={analysis.ats_score}
                  color={analysis.ats_score >= 75 ? 'bg-emerald-500' : analysis.ats_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}
                  size="md"
                />
              </div>
            </Card>

            <div className="grid sm:grid-cols-2 gap-4">
              <Card padding="md">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={15} className="text-emerald-400" />
                  <h3 className="font-semibold">Strengths</h3>
                </div>
                <div className="space-y-2">
                  {(analysis.strengths || []).map((s, i) => (
                    <div key={i} className="flex gap-2 text-sm text-slate-300">
                      <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      {s}
                    </div>
                  ))}
                </div>
              </Card>

              <Card padding="md">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={15} className="text-amber-400" />
                  <h3 className="font-semibold">Gaps to address</h3>
                </div>
                <div className="space-y-2">
                  {(analysis.weaknesses || []).map((w, i) => (
                    <div key={i} className="flex gap-2 text-sm text-slate-300">
                      <AlertCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                      {w}
                    </div>
                  ))}
                </div>
              </Card>

              <Card padding="md">
                <h3 className="font-semibold mb-3">Detected skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {(analysis.skills || []).map(s => (
                    <Badge key={s} color="purple">{s}</Badge>
                  ))}
                </div>
              </Card>

              <Card padding="md">
                <h3 className="font-semibold mb-3">ATS keywords</h3>
                <div className="flex flex-wrap gap-1.5">
                  {(analysis.keywords || []).map(k => (
                    <Badge key={k} color="blue">{k}</Badge>
                  ))}
                </div>
              </Card>
            </div>

            <Card padding="md">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={15} className="text-indigo-400" />
                <h3 className="font-semibold">Recommendations</h3>
              </div>
              <div className="space-y-2">
                {(analysis.recommendations || []).map((r, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl bg-surface-3/50 border border-white/5">
                    <span className="font-mono text-xs text-indigo-400 font-bold shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm text-slate-300 leading-relaxed">{r}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
