import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../lib/api'
import {
  Button, Card, PageHeader, Badge, ProgressBar, Radio, Spinner, EmptyState,
} from '../components/ui'
import { PageTransition } from '../components/layout/PageTransition'
import {
  UserCheck, RotateCcw, Copy, RefreshCw, Bot, User,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Resume { id: string; filename: string }
interface Report {
  id: string
  shortlist_probability: number
  recruiter_notes: string
  strengths: string[]
  weaknesses: string[]
  risk_factors: string[]
  hiring_recommendation: string
  interview_questions: { question: string; type: string }[]
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  typing?: boolean
}

function TypingIndicator() {
  return (
    <div className="flex gap-1.5 px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          className="h-2 w-2 rounded-full bg-indigo-400"
        />
      ))}
    </div>
  )
}

export default function Recruiter() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<Report | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.get('/resumes/').then(r => {
      setResumes(r.data)
      if (r.data[0]) setSelected(r.data[0].id)
    })
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  const buildMessages = (data: Report, filename: string): ChatMessage[] => {
    const msgs: ChatMessage[] = [
      {
        id: '1',
        role: 'user',
        content: `Please review my resume (${filename}) and give me an honest recruiter assessment.`,
        timestamp: new Date(),
      },
    ]

    const verdict = `**Recruiter Verdict: ${data.hiring_recommendation}**\n\nShortlist probability: **${Math.round(data.shortlist_probability)}%**\n\n${data.recruiter_notes}`

    const strengths = data.strengths?.length
      ? `\n\n**Strengths:**\n${data.strengths.map(s => `• ${s}`).join('\n')}`
      : ''

    const weaknesses = data.weaknesses?.length
      ? `\n\n**Weaknesses:**\n${data.weaknesses.map(w => `• ${w}`).join('\n')}`
      : ''

    const risks = data.risk_factors?.length
      ? `\n\n**Risk factors:**\n${data.risk_factors.map(r => `• ${r}`).join('\n')}`
      : ''

    msgs.push({
      id: '2',
      role: 'assistant',
      content: verdict + strengths + weaknesses + risks,
      timestamp: new Date(),
    })

    if (data.interview_questions?.length) {
      msgs.push({
        id: '3',
        role: 'assistant',
        content:
          `**Questions I'd ask in an interview:**\n\n` +
          data.interview_questions
            .map((q, i) => `**${i + 1}.** ${q.question}\n_${q.type}_`)
            .join('\n\n'),
        timestamp: new Date(),
      })
    }

    return msgs
  }

  const streamMessages = async (data: Report, filename: string) => {
    setStreaming(true)
    setMessages([
      {
        id: '1',
        role: 'user',
        content: `Please review my resume (${filename}) and give me an honest recruiter assessment.`,
        timestamp: new Date(),
      },
      { id: 'typing', role: 'assistant', content: '', timestamp: new Date(), typing: true },
    ])

    await new Promise(r => setTimeout(r, 1500))

    const full = buildMessages(data, filename)
    setMessages(full.slice(0, 1))
    setStreaming(false)

    for (let i = 1; i < full.length; i++) {
      setMessages(prev => [...prev.filter(m => !m.typing), { ...full[i], content: '' }])
      const text = full[i].content
      for (let j = 0; j <= text.length; j += 8) {
        await new Promise(r => setTimeout(r, 20))
        setMessages(prev => {
          const copy = [...prev]
          copy[copy.length - 1] = { ...full[i], content: text.slice(0, j) }
          return copy
        })
      }
      if (i < full.length - 1) {
        setMessages(prev => [...prev, { id: 'typing', role: 'assistant', content: '', timestamp: new Date(), typing: true }])
        await new Promise(r => setTimeout(r, 800))
        setMessages(prev => prev.filter(m => !m.typing))
      }
    }
  }

  const run = async () => {
    if (!selected) return
    setLoading(true)
    const filename = resumes.find(r => r.id === selected)?.filename || 'resume'
    try {
      const { data } = await api.post('/recruiter/', { resume_id: selected })
      setReport(data)
      await streamMessages(data, filename)
    } catch {
      toast.error('Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  const recColor = (r: string) =>
    r?.includes('Strong Yes') ? 'green' : r?.includes('Yes') ? 'blue' : r?.includes('Maybe') ? 'yellow' : 'red'

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text.replace(/\*\*/g, ''))
    toast.success('Copied to clipboard')
  }

  const reset = () => {
    setReport(null)
    setMessages([])
  }

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      const italic = bold.replace(/_(.*?)_/g, '<em class="text-slate-500">$1</em>')
      if (line.startsWith('• ')) {
        return <p key={i} className="text-sm text-slate-300 ml-2" dangerouslySetInnerHTML={{ __html: italic }} />
      }
      return line ? (
        <p key={i} className="text-sm text-slate-300 mb-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: italic }} />
      ) : (
        <br key={i} />
      )
    })
  }

  return (
    <PageTransition>
      <PageHeader
        title="AI Recruiter"
        subtitle="Simulate how a senior recruiter at a top company reviews your resume."
        action={
          report ? (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" icon={<RefreshCw size={14} />} onClick={run} loading={loading}>
                Regenerate
              </Button>
              <Button variant="ghost" size="sm" icon={<RotateCcw size={14} />} onClick={reset}>
                New review
              </Button>
            </div>
          ) : undefined
        }
      />

      {!report ? (
        <div className="max-w-xl">
          <Card padding="lg">
            <h3 className="font-bold text-lg mb-4">Select resume to review</h3>
            {resumes.length === 0 ? (
              <EmptyState
                icon={<UserCheck size={28} />}
                title="No resumes found"
                description="Upload a resume first to get a recruiter review."
                action={
                  <Link to="/resume-lab">
                    <Button size="sm">Upload resume</Button>
                  </Link>
                }
              />
            ) : (
              <>
                <div className="space-y-2 mb-5">
                  {resumes.map(r => (
                    <Radio
                      key={r.id}
                      checked={selected === r.id}
                      onChange={() => setSelected(r.id)}
                      label={r.filename}
                    />
                  ))}
                </div>
                <Card padding="md" glass={false} className="bg-surface-3/50 mb-5">
                  <p className="text-sm text-slate-400">
                    <strong className="text-white">What this simulates:</strong> A senior technical recruiter&apos;s first-pass review — shortlist probability, honest assessment, hiring recommendation, and questions they&apos;d ask.
                  </p>
                </Card>
                <Button onClick={run} loading={loading} icon={<UserCheck size={16} />} fullWidth>
                  Generate recruiter review
                </Button>
              </>
            )}
          </Card>
        </div>
      ) : (
        <div className="flex flex-col h-[calc(100vh-12rem)] max-w-3xl mx-auto">
          {/* Verdict bar */}
          <Card padding="md" className="mb-4 shrink-0">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Badge color={recColor(report.hiring_recommendation) as 'green' | 'blue' | 'yellow' | 'red'} size="md">
                  {report.hiring_recommendation}
                </Badge>
                <span className="text-sm text-slate-400">
                  {Math.round(report.shortlist_probability)}% shortlist probability
                </span>
              </div>
              <div className="w-32">
                <ProgressBar
                  value={report.shortlist_probability}
                  color={
                    report.shortlist_probability >= 60
                      ? 'bg-emerald-500'
                      : report.shortlist_probability >= 40
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }
                />
              </div>
            </div>
          </Card>

          {/* Chat */}
          <Card padding="none" className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`h-8 w-8 rounded-xl shrink-0 flex items-center justify-center ${
                        msg.role === 'user'
                          ? 'bg-indigo-500/20 border border-indigo-500/30'
                          : 'bg-surface-3 border border-white/10'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <User size={14} className="text-indigo-400" />
                      ) : (
                        <Bot size={14} className="text-slate-400" />
                      )}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-indigo-500/15 border border-indigo-500/20'
                          : 'bg-surface-3/80 border border-white/5'
                      }`}
                    >
                      {msg.typing ? (
                        <TypingIndicator />
                      ) : (
                        <>
                          {msg.role === 'assistant' ? renderMarkdown(msg.content) : (
                            <p className="text-sm text-slate-200">{msg.content}</p>
                          )}
                          {msg.role === 'assistant' && !msg.typing && (
                            <div className="flex gap-2 mt-3 pt-2 border-t border-white/5">
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<Copy size={12} />}
                                onClick={() => copyMessage(msg.content)}
                                className="h-8 text-xs"
                              >
                                Copy
                              </Button>
                              <span className="text-[10px] text-slate-600 self-center ml-auto">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && messages.length === 0 && (
                <div className="flex justify-center py-12">
                  <Spinner size={28} />
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </Card>
        </div>
      )}
    </PageTransition>
  )
}
