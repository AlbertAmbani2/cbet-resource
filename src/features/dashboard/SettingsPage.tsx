import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Globe2,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PageHeader,
  Skeleton,
} from '../../components/ui'
import { useAuth } from '../auth'
import { useTrainerProfile } from './useTrainerProfile'

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—'

export default function SettingsPage() {
  const { logout } = useAuth()
  const { profile, loading } = useTrainerProfile()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Account settings"
        description="Review your account details and manage access to the trainer portal."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <Badge tone={profile?.isVerified ? 'brand' : 'amber'}>
              {profile?.isVerified ? 'Verified' : 'Active'}
            </Badge>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 pb-4">
                  <Avatar name={profile?.fullName} size="lg" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{profile?.fullName}</p>
                    <p className="truncate text-xs text-slate-500">{profile?.email}</p>
                  </div>
                </div>
                <dl className="space-y-3 border-t border-slate-100 pt-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="inline-flex items-center gap-2 text-slate-500">
                      <Mail size={14} /> Email
                    </dt>
                    <dd className="truncate font-medium text-slate-800">{profile?.email ?? '—'}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="inline-flex items-center gap-2 text-slate-500">
                      <UserRound size={14} /> Department
                    </dt>
                    <dd className="font-medium text-slate-800">{profile?.department ?? '—'}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="inline-flex items-center gap-2 text-slate-500">
                      <CalendarDays size={14} /> Joined
                    </dt>
                    <dd className="font-medium text-slate-800">{formatDate(profile?.createdAt)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="inline-flex items-center gap-2 text-slate-500">
                      <BadgeCheck size={14} /> Verification
                    </dt>
                    <dd className="font-medium capitalize text-slate-800">
                      {profile?.verificationStatus ?? (profile?.isVerified ? 'verified' : 'pending')}
                    </dd>
                  </div>
                </dl>
                <Link to="/dashboard/profile" className="mt-4 inline-block">
                  <Button variant="secondary" size="sm">
                    Edit account details
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Public presence</CardTitle>
              <Globe2 size={17} className="text-slate-400" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Your public trainer page shows your name, department, institution, bio, and approved
                resources.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {profile?.id && (
                  <Link to={`/trainer/${profile.id}`}>
                    <Button variant="secondary" size="sm" trailingIcon={<ArrowUpRight size={14} />}>
                      View public profile
                    </Button>
                  </Link>
                )}
                <Link to="/">
                  <Button variant="ghost" size="sm" trailingIcon={<ArrowUpRight size={14} />}>
                    Return to site
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session</CardTitle>
              <ShieldCheck size={17} className="text-slate-400" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Signing out clears this device's trainer session. You can sign back in at any time.
              </p>
              <Button
                variant="danger"
                size="sm"
                className="mt-4"
                onClick={handleLogout}
                leadingIcon={<LogOut size={14} />}
              >
                Sign out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
