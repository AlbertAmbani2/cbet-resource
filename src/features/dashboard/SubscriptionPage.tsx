import { CreditCard } from 'lucide-react'
import { Card, CardContent, PageHeader, Skeleton } from '../../components/ui'
import { SubscriptionSection } from '../subscription'
import { useTrainerProfile } from './useTrainerProfile'

export default function SubscriptionPage() {
  const { trainerId, loading, error } = useTrainerProfile()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Subscription"
        title="Plans & billing"
        description="Manage your trainer plan, review payment history, and keep your account active."
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <CreditCard size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Billing is handled securely</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Payment plans and history are managed by the CBET resource platform. Contact support if a
              charge looks incorrect.
            </p>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : trainerId ? (
        <SubscriptionSection trainerId={trainerId} />
      ) : (
        <p className="text-sm text-slate-500">Subscription details are unavailable right now.</p>
      )}
    </div>
  )
}
