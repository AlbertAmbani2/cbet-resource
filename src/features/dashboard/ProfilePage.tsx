import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  AtSign,
  BadgeCheck,
  Building2,
  CalendarDays,
  GraduationCap,
  Mail,
  UserRound,
} from 'lucide-react'
import { Avatar, Badge, Card, CardContent, CardHeader, CardTitle, PageHeader, Skeleton } from '../../components/ui'
import { ProfileUpdateForm } from './ProfileUpdateForm'
import { useTrainerProfile } from './useTrainerProfile'

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—'

export default function ProfilePage() {
  const { profile, loading, error, save } = useTrainerProfile()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profile"
        title="Your trainer profile"
        description="This is how other trainers see you. Keep your details current so learners and peers can find you."
        actions={
          profile && (
            <Link
              to={`/trainer/${profile.id}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              View public profile <ArrowUpRight size={15} />
            </Link>
          )
        }
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="h-fit overflow-hidden">
          <div className="h-24 bg-gradient-to-br from-brand-500 via-brand-600 to-emerald-700" />
          <CardContent className="-mt-10">
            <Avatar name={profile?.fullName} size="xl" className="ring-4 ring-white" />
            <div className="mt-3">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{profile?.fullName ?? 'Your name'}</h2>
                {(profile?.verificationStatus === 'verified' || profile?.isVerified) && (
                  <Badge tone="brand">
                    <BadgeCheck size={12} /> Verified
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {profile?.bio || 'Add a short bio to introduce yourself to the community.'}
              </p>
            </div>

            <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <GraduationCap size={15} />
                </span>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-slate-400">Department</dt>
                  <dd className="font-medium text-slate-800">{profile?.department ?? '—'}</dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <Building2 size={15} />
                </span>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-slate-400">Institution</dt>
                  <dd className="font-medium text-slate-800">{profile?.institution || 'Not added yet'}</dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <Mail size={15} />
                </span>
                <div className="min-w-0">
                  <dt className="text-[11px] uppercase tracking-wide text-slate-400">Contact email</dt>
                  <dd className="truncate font-medium text-slate-800">
                    {profile?.contactEmail || profile?.email || '—'}
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <CalendarDays size={15} />
                </span>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-slate-400">Member since</dt>
                  <dd className="font-medium text-slate-800">{formatDate(profile?.createdAt)}</dd>
                </div>
              </div>
            </dl>

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
              <AtSign size={13} className="shrink-0" />
              <span className="truncate">{profile?.email}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Edit profile details</CardTitle>
              <p className="mt-0.5 text-xs text-slate-500">
                Changes are published to your public trainer page right away.
              </p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <UserRound size={17} />
            </span>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-11 w-40" />
              </div>
            ) : profile ? (
              <ProfileUpdateForm profile={profile} onSuccess={save} />
            ) : (
              <p className="text-sm text-slate-500">Profile details are unavailable right now.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
