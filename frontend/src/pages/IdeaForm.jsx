import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { saveIdea } from '../utils/storage'
import { analyzeIdea } from '../services/api'

const INDUSTRIES = ['', 'EdTech', 'FinTech', 'HealthTech', 'AgriTech', 'Logistics', 'Other']
const GEOGRAPHIES = ['', 'India', 'US', 'Europe', 'Southeast Asia', 'Global', 'Other']
const BUSINESS_MODELS = ['', 'SaaS', 'Marketplace', 'D2C', 'Freemium', 'B2B', 'Other']

const REQUIRED_FIELDS = ['startupName', 'problem', 'targetCustomer', 'industry', 'geography', 'businessModel']

const SparkleIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
  </svg>
)

const ChevronIcon = () => (
  <svg
    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
)

const InfoCircleIcon = () => (
  <svg
    className="h-5 w-5 text-[#534AB7]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

const BriefcaseIcon = () => (
  <svg
    className="h-5 w-5 text-[#534AB7]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
  </svg>
)

export default function IdeaSubmitPage() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [startupName, setStartupName] = useState('')
  const [problem, setProblem] = useState('')
  const [targetCustomer, setTargetCustomer] = useState('')
  const [industry, setIndustry] = useState('')
  const [geography, setGeography] = useState('')
  const [businessModel, setBusinessModel] = useState('')
  const [pricing, setPricing] = useState('')
  const [assumptions, setAssumptions] = useState('')
  const [founderBg, setFounderBg] = useState('')

  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const inputBase =
    'block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition'
  const inputNormal = `${inputBase} border-gray-300 focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20`
  const inputError = `${inputBase} border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20`

  const selectBase =
    'block w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-10 text-sm text-gray-900 outline-none transition cursor-pointer'
  const selectNormal = `${selectBase} border-gray-300 focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20`
  const selectError = `${selectBase} border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20`

  const getInputClass = (field) => (errors[field] ? inputError : inputNormal)
  const getSelectClass = (field) => (errors[field] ? selectError : selectNormal)

  const handleSubmit = async () => {
    setSubmitted(true)

    const values = { startupName, problem, targetCustomer, industry, geography, businessModel }
    const newErrors = {}

    REQUIRED_FIELDS.forEach((field) => {
      if (!values[field] || values[field].trim() === '') {
        newErrors[field] = true
      }
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const saved = await saveIdea({
        startupName,
        problem,
        targetCustomer,
        industry,
        geography,
        businessModel,
        pricing,
        assumptions,
        founderBg,
      })

      // Trigger AI analysis in the background
      analyzeIdea(saved.id).catch(() => {})

      navigate(`/report?id=${saved.id}`)
    } catch (err) {
      alert(err.message || 'Failed to save idea to database');
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar activePage="New Idea" mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-[260px] flex-1 px-4 py-6 sm:py-8 min-h-[calc(100vh-4rem)]">
        <div className="max-w-[680px] mx-auto">
          {/* Page heading */}
          <h1 className="text-2xl font-bold text-gray-900">Submit your startup idea</h1>
          <p className="text-sm text-gray-500 mt-1 mb-8">
            The more specific you are, the better the AI analysis
          </p>

          {/* Card 1 — Basic information */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-5">
              <InfoCircleIcon />
              <h2 className="text-base font-semibold text-gray-900">Basic information</h2>
            </div>

            {/* Startup Name */}
            <div className="mb-4">
              <label htmlFor="startupName" className="mb-1.5 block text-sm font-medium text-gray-700">
                Startup Name <span className="text-red-500">*</span>
              </label>
              <input
                id="startupName"
                type="text"
                required
                className={getInputClass('startupName')}
                value={startupName}
                onChange={(e) => {
                  setStartupName(e.target.value)
                  clearError('startupName')
                }}
                placeholder="e.g. Acme Corp"
              />
              {errors.startupName && (
                <p className="mt-1 text-xs text-red-500">This field is required</p>
              )}
            </div>

            {/* Problem Statement */}
            <div className="mb-4">
              <label htmlFor="problem" className="mb-1.5 block text-sm font-medium text-gray-700">
                Problem Statement <span className="text-red-500">*</span>
              </label>
              <textarea
                id="problem"
                rows={3}
                required
                className={getInputClass('problem')}
                value={problem}
                onChange={(e) => {
                  setProblem(e.target.value)
                  clearError('problem')
                }}
                placeholder="What specific problem are you solving?"
              />
              {errors.problem && (
                <p className="mt-1 text-xs text-red-500">This field is required</p>
              )}
            </div>

            {/* Target Customer */}
            <div className="mb-4">
              <label htmlFor="targetCustomer" className="mb-1.5 block text-sm font-medium text-gray-700">
                Target Customer <span className="text-red-500">*</span>
              </label>
              <input
                id="targetCustomer"
                type="text"
                required
                className={getInputClass('targetCustomer')}
                value={targetCustomer}
                onChange={(e) => {
                  setTargetCustomer(e.target.value)
                  clearError('targetCustomer')
                }}
                placeholder="Who experiences this problem the most?"
              />
              {errors.targetCustomer && (
                <p className="mt-1 text-xs text-red-500">This field is required</p>
              )}
            </div>

            {/* Industry & Geography side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Industry */}
              <div>
                <label htmlFor="industry" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Industry <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="industry"
                    required
                    className={getSelectClass('industry')}
                    value={industry}
                    onChange={(e) => {
                      setIndustry(e.target.value)
                      clearError('industry')
                    }}
                  >
                    <option value="" disabled>
                      Select Industry
                    </option>
                    {INDUSTRIES.filter(Boolean).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronIcon />
                </div>
                {errors.industry && (
                  <p className="mt-1 text-xs text-red-500">This field is required</p>
                )}
              </div>

              {/* Geography */}
              <div>
                <label htmlFor="geography" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Geography <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="geography"
                    required
                    className={getSelectClass('geography')}
                    value={geography}
                    onChange={(e) => {
                      setGeography(e.target.value)
                      clearError('geography')
                    }}
                  >
                    <option value="" disabled>
                      Select Geography
                    </option>
                    {GEOGRAPHIES.filter(Boolean).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronIcon />
                </div>
                {errors.geography && (
                  <p className="mt-1 text-xs text-red-500">This field is required</p>
                )}
              </div>
            </div>
          </div>

          {/* Card 2 — Business details */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-5">
              <BriefcaseIcon />
              <h2 className="text-base font-semibold text-gray-900">Business details</h2>
            </div>

            {/* Business Model & Pricing side by side */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Business Model */}
              <div>
                <label htmlFor="businessModel" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Business Model <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="businessModel"
                    required
                    className={getSelectClass('businessModel')}
                    value={businessModel}
                    onChange={(e) => {
                      setBusinessModel(e.target.value)
                      clearError('businessModel')
                    }}
                  >
                    <option value="" disabled>
                      Select Model
                    </option>
                    {BUSINESS_MODELS.filter(Boolean).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronIcon />
                </div>
                {errors.businessModel && (
                  <p className="mt-1 text-xs text-red-500">This field is required</p>
                )}
              </div>

              {/* Pricing Strategy */}
              <div>
                <label htmlFor="pricing" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Pricing Strategy
                </label>
                <input
                  id="pricing"
                  type="text"
                  className={inputNormal}
                  value={pricing}
                  onChange={(e) => setPricing(e.target.value)}
                  placeholder="e.g. $29/month per user"
                />
              </div>
            </div>

            {/* Key Assumptions */}
            <div className="mb-4">
              <label htmlFor="assumptions" className="mb-1.5 block text-sm font-medium text-gray-700">
                Key Assumptions
              </label>
              <textarea
                id="assumptions"
                rows={2}
                className={inputNormal}
                value={assumptions}
                onChange={(e) => setAssumptions(e.target.value)}
                placeholder="What must be true for this to succeed?"
              />
            </div>

            {/* Founder Background */}
            <div>
              <label htmlFor="founderBg" className="mb-1.5 block text-sm font-medium text-gray-700">
                Founder Background{' '}
                <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                id="founderBg"
                type="text"
                className={inputNormal}
                value={founderBg}
                onChange={(e) => setFounderBg(e.target.value)}
                placeholder="Relevant experience or domain expertise"
              />
            </div>
          </div>

          {/* Bottom buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[#534AB7] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#443DA0] focus:outline-none focus:ring-2 focus:ring-[#534AB7]/40 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" /></svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <SparkleIcon />
                  Analyze with AI
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
