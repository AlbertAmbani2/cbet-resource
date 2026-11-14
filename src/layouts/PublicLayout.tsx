import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { TrainerSignupModal } from '../features/onboarding'

export default function PublicLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="app relative w-full">
      <div className="relative z-10">
        <TrainerSignupModal />
        <Header />
        <main className={isHome ? undefined : 'pt-24'}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
