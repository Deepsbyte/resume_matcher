import { ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/auth'
import {
  LayoutDashboard, FileText, Briefcase, UserCheck, MessageSquare,
  Github, BarChart2, Settings, LogOut, Zap, ChevronLeft, Menu, X,
  Bell, Moon, Sun, Search, Command,
} from 'lucide-react'
import { SidebarItem, Avatar, Button, CommandPalette, useCommandPalette } from '../ui'
import { cn } from '../../lib/utils'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/resume-lab', icon: FileText, label: 'Resume Lab' },
  { to: '/job-match', icon: Briefcase, label: 'Job Match' },
  { to: '/recruiter', icon: UserCheck, label: 'AI Recruiter' },
  { to: '/interview-prep', icon: MessageSquare, label: 'Interview Prep' },
  { to: '/portfolio', icon: Github, label: 'Portfolio' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
]

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const { open: cmdOpen, setOpen: setCmdOpen, onClose: closeCmd } = useCommandPalette()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={cn(
        'flex flex-col h-full bg-surface-1/95 backdrop-blur-xl border-r border-white/5',
        mobile ? 'w-[260px]' : collapsed ? 'w-[72px]' : 'w-[260px]',
        'transition-all duration-300'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5 shrink-0">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-glow shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        {(!collapsed || mobile) && (
          <motion.span
            initial={false}
            className="font-bold text-lg tracking-tight text-white"
          >
            CareerIQ
          </motion.span>
        )}
      </div>

      {/* Search shortcut */}
      {(!collapsed || mobile) && (
        <div className="px-3 pt-4">
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={() => setCmdOpen(true)}
            className="justify-between text-slate-500 font-normal"
            icon={<Search size={15} />}
            iconRight={
              <kbd className="hidden sm:inline text-[10px] bg-surface-3 px-1.5 py-0.5 rounded border border-border">
                ⌘K
              </kbd>
            }
          >
            Search...
          </Button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {NAV.map(item => (
          <SidebarItem
            key={item.to}
            {...item}
            icon={<item.icon size={18} />}
            collapsed={collapsed && !mobile}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/5 flex flex-col gap-1 shrink-0">
        <SidebarItem
          to="/settings"
          icon={<Settings size={18} />}
          label="Settings"
          collapsed={collapsed && !mobile}
          onClick={() => setMobileOpen(false)}
        />

        <div className={cn('flex items-center gap-2 mt-2 px-2', collapsed && !mobile && 'justify-center')}>
          <Avatar name={user?.full_name} size="sm" />
          {(!collapsed || mobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.full_name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            </div>
          )}
          {(!collapsed || mobile) && (
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" onClick={() => setDarkMode(d => !d)} aria-label="Toggle theme">
                {darkMode ? <Moon size={15} /> : <Sun size={15} />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                <LogOut size={15} />
              </Button>
            </div>
          )}
        </div>

        {!mobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(c => !c)}
            className={cn('mt-1', collapsed && 'justify-center')}
            icon={collapsed ? <ChevronLeft size={14} className="rotate-180" /> : <ChevronLeft size={14} />}
          >
            {!collapsed && 'Collapse'}
          </Button>
        )}
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-screen">
      <CommandPalette open={cmdOpen} onClose={closeCmd} />

      {/* Desktop sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="absolute left-0 top-0 bottom-0"
            >
              <SidebarContent mobile />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass-strong border-b border-white/5 px-4 h-14 flex items-center gap-3 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </Button>

          <div className="lg:hidden flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="font-bold text-sm">CareerIQ</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon" onClick={() => setCmdOpen(true)} aria-label="Command palette">
              <Command size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-surface-1" />
            </Button>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
