import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../lib/api'
import {
  Button, Card, PageHeader, Badge, Textarea, ScoreRing, Input,
  Radio, Spinner, StepIndicator, SearchBox, Select, EmptyState,
} from '../components/ui'
import { PageTransition } from '../components/layout/PageTransition'
import {
  Briefcase, AlertCircle, RotateCcw, MapPin, DollarSign,
  Bookmark, ExternalLink, Building2,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Resume { id: string; filename: string; created_at: string }
interface Match {
  id: string
  job_title: string
  match_score: number
  skill_match_score: number
  keyword_match_score: number
  missing_skills: string[]
  missing_keywords: string[]
  missing_technologies: string[]
  recommendations: string[]
}

type Step = 'select' | 'describe' | 'processing' | 'result'

export default function JobMatch() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResume, setSelectedResume] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [step, setStep] = useState<Step>('select')
  const [result, setResult] = useState<Match | null>(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    api.get('/resumes/').then(r => {
      setResumes(r.data)
      if (r.data.length > 0) setSelectedResume(r.data[0].id)
    })
  }, [])

  const filteredResumes = useMemo(() => {
    let list = [...resumes]
    if (search) list = list.filter(r => r.filename.toLowerCase().includes(search.toLowerCase()))
    if (sortBy === 'date') list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    else list.sort((a, b) => a.filename.localeCompare(b.filename))
    return list
  }, [resumes, search, sortBy])

  const run = async () => {
    if (!selectedResume || !jobDesc.trim()) return
    setStep('processing')
    try {
      const { data } = await api.post('/job-match/', {
        resume_id: selectedResume,
        job_title: jobTitle,
        job_description: jobDesc,
      })
      setResult(data)
      setStep('result')
    } catch {
      toast.error('Match failed')
      setStep('describe')
    }
  }

  const reset = () => {
    setStep('select')
    setResult(null)
    setJobTitle('')
    setJobDesc('')
  }

  const stepIndex = { select: 0, describe: 1, processing: 2, result: 3 }[step]

  return (
    <PageTransition>
      <PageHeader
        title="Job Match"
        subtitle="Paste a job description and get a precise skills gap analysis."
        action={
          step === 'result' ? (
            <Button variant="ghost" size="sm" icon={<RotateCcw size={14} />} onClick={reset}>
              New match
            </Button>
          ) : undefined
        }
      />

      {step !== 'result' && (
        <StepIndicator
          steps={['Select resume', 'Job description', 'Processing', 'Results']}
          current={stepIndex}
        />
      )}

      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl">
            <Card padding="lg">
              <h3 className="font-bold text-lg mb-4">Select a resume</h3>

              {resumes.length === 0 ? (
                <EmptyState
                  icon={<Briefcase size={28} />}
                  title="No resumes found"
                  description="Upload a resume first to run job matching."
                  action={
                    <Link to="/resume-lab">
                      <Button size="sm">Go to Resume Lab</Button>
                    </Link>
                  }
                />
              ) : (
                <>
                  <div className="flex gap-3 mb-4">
                    <SearchBox value={search} onChange={setSearch} placeholder="Search resumes..." className="flex-1" />
                    <Select
                      value={sortBy}
                      onChange={setSortBy}
                      options={[
                        { value: 'date', label: 'Newest first' },
                        { value: 'name', label: 'Name A–Z' },
                      ]}
                      className="w-40"
                    />
                  </div>

                  <div className="space-y-2 mb-6">
                    {filteredResumes.map(r => (
                      <Radio
                        key={r.id}
                        checked={selectedResume === r.id}
                        onChange={() => setSelectedResume(r.id)}
                        label={r.filename}
                        description={new Date(r.created_at).toLocaleDateString()}
                        icon={<Briefcase size={16} />}
                      />
                    ))}
                  </div>

                  <Button onClick={() => setStep('describe')} disabled={!selectedResume} fullWidth>
                    Continue
                  </Button>
                </>
              )}
            </Card>
          </motion.div>
        )}

        {step === 'describe' && (
          <motion.div key="describe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
            <Card padding="lg" className="space-y-5">
              <h3 className="font-bold text-lg">Job description</h3>
              <Input
                label="Job title"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Software Engineering Intern"
              />
              <Textarea
                label="Paste the full job description"
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                placeholder="Copy and paste the job description here..."
                rows={10}
              />
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep('select')}>Back</Button>
                <Button onClick={run} disabled={!jobDesc.trim()}>Generate match analysis</Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div key="processing" className="text-center py-20">
            <div className="h-16 w-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
              <Spinner size={32} />
            </div>
            <p className="font-bold text-lg mb-2">Matching your resume...</p>
            <p className="text-slate-400 text-sm">Comparing skills, keywords, and technologies</p>
          </motion.div>
        )}

        {step === 'result' && result && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Job card */}
            <Card padding="lg" hover className="gradient-border">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <Building2 size={28} className="text-indigo-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-1">{result.job_title || 'Match results'}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-400 mb-4">
                    <span className="flex items-center gap-1"><MapPin size={13} /> Remote / Hybrid</span>
                    <span className="flex items-center gap-1"><DollarSign size={13} /> Competitive</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge color="green">{Math.round(result.match_score)}% match</Badge>
                    <Badge color="blue">Skills {Math.round(result.skill_match_score)}%</Badge>
                    <Badge color="purple">Keywords {Math.round(result.keyword_match_score)}%</Badge>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" icon={<Bookmark size={14} />}>Save</Button>
                  <Button size="sm" icon={<ExternalLink size={14} />}>Apply</Button>
                </div>
              </div>
            </Card>

            {/* Scores */}
            <Card padding="lg">
              <div className="flex flex-wrap gap-8 justify-center">
                <ScoreRing score={result.match_score} label="Overall match" size={100} />
                <ScoreRing score={result.skill_match_score} label="Skills match" size={100} />
                <ScoreRing score={result.keyword_match_score} label="Keyword match" size={100} />
              </div>
            </Card>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Missing skills', items: result.missing_skills, color: 'red' as const },
                { label: 'Missing keywords', items: result.missing_keywords, color: 'yellow' as const },
                { label: 'Missing technologies', items: result.missing_technologies, color: 'blue' as const },
              ].map(({ label, items, color }) => (
                <Card key={label} padding="md">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={14} className={`text-${color === 'red' ? 'red' : color === 'yellow' ? 'amber' : 'blue'}-400`} />
                    <h4 className="font-semibold text-sm">{label}</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {items?.length ? items.map(i => <Badge key={i} color={color}>{i}</Badge>) : (
                      <span className="text-xs text-slate-500">None identified</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <Card padding="md">
              <h4 className="font-semibold mb-4">Recommendations to improve your match</h4>
              <div className="space-y-2">
                {result.recommendations?.map((r, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl bg-surface-3/50 border border-white/5 text-sm text-slate-300">
                    <span className="font-mono text-xs text-indigo-400 font-bold shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {r}
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
