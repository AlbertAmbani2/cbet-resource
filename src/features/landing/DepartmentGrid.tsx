import { ChevronRight, Laptop, Briefcase, Car, Hotel, HardHat, Plane, Palmtree, Stethoscope } from 'lucide-react'
import './DepartmentGrid.css'
import { departments, mockResources } from '../../lib/mockData'

const DEPARTMENT_ICONS: Record<string, React.ReactNode> = {
  'ICT': <Laptop size={24} />,
  'Business': <Briefcase size={24} />,
  'Automotive': <Car size={24} />,
  'Hospitality': <Hotel size={24} />,
  'Construction': <HardHat size={24} />,
  'Tourism': <Plane size={24} />,
  'Agriculture': <Palmtree size={24} />,
  'Health': <Stethoscope size={24} />,
}

interface DepartmentGridProps {
  onSelectDept: (deptId: string) => void
}

export default function DepartmentGrid({ onSelectDept }: DepartmentGridProps) {
  // Count resources per department
  const getResourceCount = (deptName: string) => {
    return mockResources.filter(r => r.department === deptName).length
  }

  // Get trainer count per department (from resource assignments)
  const getTrainerCount = (deptName: string) => {
    const trainers = new Set(
      mockResources
        .filter(r => r.department === deptName)
        .map(r => r.trainerName)
    )
    return trainers.size
  }

  return (
    <div className="department-grid-container">
      <div className="department-grid">
        {departments.map(dept => {
          const resourceCount = getResourceCount(dept.name)
          const trainerCount = getTrainerCount(dept.name)

          return (
            <button
              key={dept.id}
              className="department-card"
              onClick={() => onSelectDept(dept.id)}
            >
              <div className="dept-header">
                <div className="dept-icon">{DEPARTMENT_ICONS[dept.name] || <Laptop size={24} />}</div>
                <ChevronRight size={20} className="dept-chevron" />
              </div>

              <h3 className="dept-name">{dept.name}</h3>

              <div className="dept-stats">
                <div className="stat">
                  <span className="stat-number">{resourceCount}</span>
                  <span className="stat-label">Resource{resourceCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat">
                  <span className="stat-number">{trainerCount}</span>
                  <span className="stat-label">Trainer{trainerCount !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {resourceCount === 0 && (
                <div className="dept-coming-soon">Coming Soon</div>
              )}

              {resourceCount > 0 && (
                <div className="dept-topics">
                  <span className="topics-label">Topics:</span>
                  <div className="topics-list">
                    {/* Show sample topics from first 2 resources in department */}
                    {mockResources
                      .filter(r => r.department === dept.name)
                      .slice(0, 2)
                      .map((resource, idx) => (
                        <span key={idx} className="topic-badge">
                          {resource.title.split(' ')[0]}
                        </span>
                      ))}
                    {resourceCount > 2 && (
                      <span className="topic-badge more">+{resourceCount - 2}</span>
                    )}
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
