import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/auth'
import {
  Card, PageHeader, Button, Badge, Input, Toggle, Tabs,
} from '../components/ui'
import { PageTransition } from '../components/layout/PageTransition'
import { User, Shield, Trash2, Bell, Palette } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Settings() {
  const { user } = useAuthStore()
  const [name, setName] = useState(user?.full_name || '')
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [emailDigest, setEmailDigest] = useState(false)
  const [tab, setTab] = useState('profile')

  const save = () => {
    setSaved(true)
    toast.success('Settings saved')
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <PageTransition>
      <PageHeader title="Settings" subtitle="Manage your account and preferences." />

      <Tabs
        tabs={[
          { id: 'profile', label: 'Profile', icon: <User size={14} /> },
          { id: 'security', label: 'Security', icon: <Shield size={14} /> },
          { id: 'preferences', label: 'Preferences', icon: <Palette size={14} /> },
        ]}
        active={tab}
        onChange={setTab}
        className="mb-8 max-w-lg"
      />

      <div className="max-w-2xl space-y-6">
        {tab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                  <User size={18} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold">Profile</h3>
                  <p className="text-xs text-slate-500">Update your personal information</p>
                </div>
              </div>

              <div className="space-y-5">
                <Input label="Full name" value={name} onChange={e => setName(e.target.value)} />
                <Input label="Email" value={user?.email || ''} disabled />
                <div className="flex items-center gap-3">
                  <Button onClick={save} size="md">
                    {saved ? 'Saved!' : 'Save changes'}
                  </Button>
                  <Badge
                    color={user?.role === 'admin' ? 'purple' : user?.role === 'recruiter' ? 'blue' : 'green'}
                  >
                    {user?.role}
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {tab === 'security' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                  <Shield size={18} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold">Change password</h3>
                  <p className="text-xs text-slate-500">Keep your account secure</p>
                </div>
              </div>

              <div className="space-y-4">
                <Input label="Current password" type="password" placeholder="••••••••" />
                <Input label="New password" type="password" placeholder="••••••••" />
                <Input label="Confirm password" type="password" placeholder="••••••••" />
                <Button variant="secondary" size="md" onClick={() => toast.success('Password update coming soon')}>
                  Update password
                </Button>
              </div>
            </Card>

            <Card padding="lg" className="border-red-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Trash2 size={18} className="text-red-400" />
                <h3 className="font-bold text-red-400">Danger zone</h3>
              </div>
              <p className="text-sm text-slate-400 mb-5">
                Permanently delete your account and all associated data. This cannot be undone.
              </p>
              <Button
                variant="danger"
                size="md"
                onClick={() => toast.error('Contact support to delete your account')}
              >
                Delete account
              </Button>
            </Card>
          </motion.div>
        )}

        {tab === 'preferences' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                  <Bell size={18} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold">Notifications</h3>
                  <p className="text-xs text-slate-500">Control how we reach you</p>
                </div>
              </div>

              <div className="space-y-5">
                <Toggle
                  checked={notifications}
                  onChange={setNotifications}
                  label="Push notifications"
                  description="Get notified when analyses complete"
                />
                <Toggle
                  checked={emailDigest}
                  onChange={setEmailDigest}
                  label="Weekly email digest"
                  description="Summary of your career progress"
                />
                <Button onClick={save} size="md">Save preferences</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}
