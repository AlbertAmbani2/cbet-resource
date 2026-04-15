import './TrainersHub.css'
import { TrainerOnboarding } from '../features/TrainerOnboarding'
import { useTrainerSignup } from '../features/TrainerOnboarding'

export default function TrainersHub() {
  const { openSignup } = useTrainerSignup()
  return (
    <section id="trainers-hub" className="trainers-hub">
      <div className="container">
        <TrainerOnboarding.Preview
          onSignupClick={() => openSignup('trainers-hub')}
        />
      </div>
    </section>
  )
}
