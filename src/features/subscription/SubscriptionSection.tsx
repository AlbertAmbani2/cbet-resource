import { useState, useEffect, useCallback } from 'react'
import { Loader, AlertTriangle, CheckCircle, XCircle, Zap, CreditCard, Calendar, Clock } from 'lucide-react'
import { api } from '../../lib/api'
import { API_ENDPOINTS, PAYMENT_PLAN_DETAILS } from '@shared/constants'
import type { Subscription, PaymentPlan, PaymentHistoryRecord } from '@shared/types'

interface SubscriptionSectionProps {
  trainerId: string
}

export function SubscriptionSection({ trainerId }: SubscriptionSectionProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [plans, setPlans] = useState<PaymentPlan[]>([])
  const [payments, setPayments] = useState<PaymentHistoryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [subData, plansData, paymentsData] = await Promise.all([
        api.get<{ data: Subscription }>(API_ENDPOINTS.SUBSCRIPTION_STATUS(trainerId)).catch(() => null),
        api.get<{ data: PaymentPlan[] }>(API_ENDPOINTS.PAYMENT_PLANS).catch(() => null),
        api.get<{ data: PaymentHistoryRecord[] }>(API_ENDPOINTS.PAYMENT_HISTORY(trainerId)).catch(() => null),
      ])
      if (subData?.data) setSubscription(subData.data)
      if (plansData?.data) setPlans(plansData.data)
      if (paymentsData?.data) setPayments(paymentsData.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscription data')
    } finally {
      setLoading(false)
    }
  }, [trainerId])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  const currentPlanType = subscription?.planType || 'free'
  const planDetails = PAYMENT_PLAN_DETAILS[currentPlanType]
  const statusColor: Record<string, string> = {
    active: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    inactive: 'text-slate-600 bg-slate-50 border-slate-200',
    cancelled: 'text-red-600 bg-red-50 border-red-200',
    past_due: 'text-amber-600 bg-amber-50 border-amber-200',
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency }).format(amount)
  }

  const paymentStatusIcon: Record<string, React.ReactNode> = {
    success: <CheckCircle size={14} className="text-emerald-500" />,
    pending: <Clock size={14} className="text-amber-500" />,
    failed: <XCircle size={14} className="text-red-500" />,
    refunded: <AlertTriangle size={14} className="text-slate-400" />,
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold text-slate-900">Subscription & Billing</h2>
      <p className="mt-2 text-slate-600">Manage your plan and view payment history.</p>

      {loading && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader size={18} className="animate-spin" />
            <span className="text-sm">Loading subscription...</span>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                  <Zap size={22} className="text-sky-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{planDetails?.name || 'Free'} Plan</p>
                  <p className="text-sm text-slate-500">
                    {planDetails?.amount === 0
                      ? 'No cost'
                      : `${formatCurrency(planDetails?.amount || 0, planDetails?.currency || 'KES')}${planDetails?.billingInterval ? '/month' : ''}`
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {subscription?.subscriptionStatus && (
                  <span className={`text-xs font-medium rounded-full px-3 py-1 border ${statusColor[subscription.subscriptionStatus] || 'text-slate-600 bg-slate-50 border-slate-200'}`}>
                    {subscription.subscriptionStatus.replace('_', ' ')}
                  </span>
                )}
                {subscription?.autoRenew && (
                  <span className="text-xs font-medium text-sky-700 bg-sky-50 rounded-full px-3 py-1 border border-sky-200">
                    Auto-renew
                  </span>
                )}
              </div>
            </div>

            {subscription?.billingCycleStart && (
              <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" />
                  Started: {formatDate(subscription.billingCycleStart)}
                </span>
                {subscription.billingCycleEnd && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    Next billing: {formatDate(subscription.billingCycleEnd)}
                  </span>
                )}
              </div>
            )}

            {planDetails?.features && (
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Plan Features</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {planDetails.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {plans.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Plans</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {plans
                  .filter(p => p.active)
                  .map(plan => {
                    const isCurrentPlan = subscription?.planType === plan.planType
                    const details = PAYMENT_PLAN_DETAILS[plan.planType as keyof typeof PAYMENT_PLAN_DETAILS]
                    return (
                      <div
                        key={plan.id}
                        className={`rounded-2xl border p-5 ${
                          isCurrentPlan
                            ? 'border-sky-300 bg-sky-50'
                            : 'border-slate-200 bg-white hover:shadow-md'
                        } transition`}
                      >
                        <p className="font-semibold text-slate-900">{plan.name}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-2">
                          {plan.amount === 0 ? 'Free' : formatCurrency(plan.amount, plan.currency)}
                          {plan.billingInterval > 0 && <span className="text-sm font-normal text-slate-500">/mo</span>}
                        </p>
                        {details?.features && (
                          <ul className="mt-4 space-y-2">
                            {details.features.map((f, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        )}
                        {isCurrentPlan && (
                          <p className="mt-4 text-xs font-medium text-sky-700">Current plan</p>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {payments.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 inline-flex items-center gap-2">
                <CreditCard size={18} className="text-slate-500" />
                Payment History
              </h3>
              <div className="space-y-3">
                {payments.map(payment => (
                  <div key={payment.id} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                        {paymentStatusIcon[payment.status] || <CreditCard size={16} className="text-slate-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {payment.description || 'Payment'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{formatDate(payment.createdAt)}</span>
                          {payment.paymentMethod && (
                            <span className="capitalize">{payment.paymentMethod.replace('_', ' ')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                      <p className="text-xs capitalize text-slate-500">{payment.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!subscription && payments.length === 0 && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <CreditCard size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 text-sm">You're on the Free plan. Upgrade to unlock more features.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
