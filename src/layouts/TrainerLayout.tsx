import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  CreditCard,
  ExternalLink,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  UploadCloud,
  UserRound,
  X,
} from 'lucide-react'
import { useAuth } from '../features/auth'
import { Avatar } from '../components/ui'
import { cn } from '../lib/utils'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/resources', label: 'My Resources', icon: FolderOpen },
  { to: '/dashboard/upload', label: 'Upload Resource', icon: UploadCloud },
  { to: '/dashboard/profile', label: 'Profile', icon: UserRound },
  { to: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function TrainerLayout() {
  const { trainerData, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const current = navItems.find(item =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
  )
  const pageTitle =
    current?.label ??
    (location.pathname.startsWith('/dashboard/admin') ? 'Admin Panel' : 'Workspace')

  const closeNavigation = () => {
    setSidebarOpen(false)
    setMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
      isActive
        ? 'bg-brand-50 text-brand-700'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    )

  return (
    <div className="min-h-screen bg-slate-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Trainer portal navigation"
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <Link to="/dashboard" className="flex items-center gap-2.5" onClick={closeNavigation}>
            <img src="/images/CBET.png" alt="CBET" className="h-8 w-auto" />
            <span className="text-sm font-bold tracking-tight text-slate-900">Trainer Hub</span>
          </Link>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Workspace
          </p>
          <div className="space-y-1">
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass} onClick={closeNavigation}>
                <item.icon size={18} className="shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </div>

          {trainerData?.isAdmin && (
            <>
              <p className="px-3 pb-2 pt-6 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Administration
              </p>
              <NavLink to="/dashboard/admin" className={navLinkClass} onClick={closeNavigation}>
                <ShieldCheck size={18} className="shrink-0" />
                Admin Panel
              </NavLink>
            </>
          )}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <Link
            to="/"
            onClick={closeNavigation}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ExternalLink size={17} />
            View public site
          </Link>
          <div className="mt-2 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <Avatar name={trainerData?.fullName} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-900">
                {trainerData?.fullName ?? 'Trainer'}
              </p>
              <p className="truncate text-[11px] text-slate-500">{trainerData?.department}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-red-600"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md lg:px-8">
          <button
            type="button"
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{pageTitle}</p>
            <p className="hidden text-[11px] text-slate-500 sm:block">Trainer portal</p>
          </div>

          <button
            type="button"
            className="relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand-500" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(open => !open)}
              className="flex items-center gap-2 rounded-xl p-1 pr-2 transition hover:bg-slate-100"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <Avatar name={trainerData?.fullName} size="sm" />
              <span className="hidden max-w-[140px] truncate text-xs font-semibold text-slate-700 sm:block">
                {trainerData?.fullName ?? 'Trainer'}
              </span>
              <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div
                  role="menu"
                  className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl"
                >
                  <div className="border-b border-slate-100 px-3 py-2.5">
                    <p className="truncate text-xs font-semibold text-slate-900">{trainerData?.fullName}</p>
                    <p className="truncate text-[11px] text-slate-500">{trainerData?.email}</p>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    <Link
                      to="/dashboard/profile"
                      onClick={closeNavigation}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      role="menuitem"
                    >
                      <UserRound size={15} /> Edit profile
                    </Link>
                    <Link
                      to={`/trainer/${trainerData?.id ?? ''}`}
                      onClick={closeNavigation}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      role="menuitem"
                    >
                      <ExternalLink size={15} /> View public profile
                    </Link>
                    <Link
                      to="/"
                      onClick={closeNavigation}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      role="menuitem"
                    >
                      <ExternalLink size={15} /> Return to site
                    </Link>
                  </div>
                  <div className="mt-1 border-t border-slate-100 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                      role="menuitem"
                    >
                      <LogOut size={15} /> Log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
