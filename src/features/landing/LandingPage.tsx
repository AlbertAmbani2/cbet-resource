import { lazy, Suspense } from 'react'
import Hero from './Hero'

const LandingSections = lazy(() => import('./LandingSections'))

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <LandingSections />
      </Suspense>
    </>
  )
}
