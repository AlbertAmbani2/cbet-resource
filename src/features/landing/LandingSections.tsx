import HowItWorks from './HowItWorks'
import ResourceBrowser from '../resources/ResourceBrowser'
import TrainersHub from './TrainersHub'
import FAQ from './FAQ'
import Footer from '../../layouts/Footer'
import ErrorBoundary from '../../components/ui/ErrorBoundary'

export default function LandingSections() {
  return (
    <>
      <HowItWorks />
      <ErrorBoundary><ResourceBrowser /></ErrorBoundary>
      <TrainersHub />
      <FAQ />
      <Footer />
    </>
  )
}
