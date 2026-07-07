import { useState, useRef, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Upload, FileText, AlertTriangle, CheckCircle, Loader, Laptop, Briefcase, Car, Hotel, HardHat, Plane, Palmtree, Stethoscope, Users, X } from 'lucide-react'
import { useAuth } from '../auth'
import { api } from '../../lib/api'
import { API_ENDPOINTS, RESOURCE_TYPES, DEPARTMENTS } from '@shared/constants'
import type { Resource } from '@shared/types'

const DEPARTMENT_ICONS: Record<string, React.ReactNode> = {
  'ICT': <Laptop size={22} />,
  'Business': <Briefcase size={22} />,
  'Automotive': <Car size={22} />,
  'Hospitality': <Hotel size={22} />,
  'Construction': <HardHat size={22} />,
  'Tourism': <Plane size={22} />,
  'Agriculture': <Palmtree size={22} />,
  'Health': <Stethoscope size={22} />,
  'Other': <Users size={22} />,
}

interface FormState {
  title: string
  department: string
  resourceType: string
  description: string
  cbetUnits: string
}

export default function ResourceUploadPage() {
  const { trainerData, isInitialized } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormState>({
    title: '',
    department: '',
    resourceType: '',
    description: '',
    cbetUnits: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader size={20} className="animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!trainerData) {
    navigate('/signin')
    return null
  }

  const updateField = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const errors: Partial<Record<keyof FormState, string>> = {}
    if (!form.title.trim()) errors.title = 'Title is required'
    else if (form.title.length < 3) errors.title = 'Title must be at least 3 characters'
    if (!form.department) errors.department = 'Select a department'
    if (!form.resourceType) errors.resourceType = 'Select a resource type'
    if (!form.description.trim()) errors.description = 'Description is required'
    if (!file) errors.resourceType = 'Select a file to upload'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setError(null)
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('title', form.title.trim())
      formData.append('department', form.department)
      formData.append('resourceType', form.resourceType)
      formData.append('description', form.description.trim())
      if (form.cbetUnits.trim()) {
        formData.append('cbetUnits', form.cbetUnits.trim())
      }
      if (file) {
        formData.append('file', file)
      }

      await api.upload<Resource>(API_ENDPOINTS.RESOURCE_UPLOAD, formData)
      setSuccess(true)
      setForm({ title: '', department: '', resourceType: '', description: '', cbetUnits: '' })
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload resource'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
    setFile(selected)
  }

  const removeFile = () => {
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Resource Uploaded!</h2>
          <p className="text-slate-600 mb-6">Your resource has been submitted for review. It will be published once approved by an admin.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition"
            >
              Upload Another
            </button>
            <Link
              to="/dashboard"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-600 mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
              <Upload size={20} className="text-sky-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Upload Resource</h1>
              <p className="text-sm text-slate-500 mt-0.5">Share your CBET teaching materials with other educators</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
              <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">
                Resource Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={e => updateField('title', e.target.value)}
                placeholder="e.g. HTML & CSS Fundamentals - Lesson Plan"
                className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:border-sky-500 ${fieldErrors.title ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-sky-200'}`}
              />
              {fieldErrors.title && <p className="mt-1 text-xs text-red-600">{fieldErrors.title}</p>}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DEPARTMENTS.map(dept => (
                    <button
                      key={dept}
                      type="button"
                      className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs transition ${
                        form.department === dept
                          ? 'border-sky-500 bg-sky-50 text-sky-700'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-300'
                      }`}
                      onClick={() => updateField('department', dept)}
                    >
                      <span className={form.department === dept ? 'text-sky-600' : 'text-slate-400'}>
                        {DEPARTMENT_ICONS[dept]}
                      </span>
                      <span className="font-medium">{dept}</span>
                    </button>
                  ))}
                </div>
                {fieldErrors.department && <p className="mt-1 text-xs text-red-600">{fieldErrors.department}</p>}
              </div>

              <div>
                <label htmlFor="resourceType" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Resource Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="resourceType"
                  value={form.resourceType}
                  onChange={e => updateField('resourceType', e.target.value)}
                  className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:border-sky-500 ${
                    fieldErrors.resourceType ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-sky-200'
                  }`}
                >
                  <option value="">Select type...</option>
                  {RESOURCE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.resourceType && <p className="mt-1 text-xs text-red-600">{fieldErrors.resourceType}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={e => updateField('description', e.target.value)}
                rows={4}
                placeholder="Describe what this resource covers, its intended audience, and key topics..."
                className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:border-sky-500 ${
                  fieldErrors.description ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-sky-200'
                }`}
              />
              <p className="mt-1 text-xs text-slate-400 text-right">{form.description.length}/5000</p>
              {fieldErrors.description && <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>}
            </div>

            <div>
              <label htmlFor="cbetUnits" className="block text-sm font-medium text-slate-700 mb-1.5">
                CBET Units <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                id="cbetUnits"
                type="text"
                value={form.cbetUnits}
                onChange={e => updateField('cbetUnits', e.target.value)}
                placeholder="e.g. Unit 301, Unit 302"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                File <span className="text-red-500">*</span>
              </label>
              {file ? (
                <div className="flex items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-3">
                  <FileText size={20} className="text-sky-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 rounded-full hover:bg-sky-100 transition"
                    aria-label="Remove file"
                  >
                    <X size={16} className="text-slate-400" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center hover:border-sky-400 hover:bg-sky-50 transition"
                >
                  <Upload size={28} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm font-medium text-slate-600">Click to select a file</p>
                  <p className="text-xs text-slate-400 mt-0.5">PDF, DOC, DOCX, PPT, PPTX (max 50 MB)</p>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload Resource
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
