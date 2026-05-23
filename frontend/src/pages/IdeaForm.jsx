import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { saveIdea } from '../utils/storage'

const INDUSTRIES = ['', 'EdTech', 'FinTech', 'HealthTech', 'AgriTech', 'Logistics', 'Other']
const GEOGRAPHIES = ['', 'India', 'US', 'Europe', 'Southeast Asia', 'Global', 'Other']
const BUSINESS_MODELS = ['', 'SaaS', 'Marketplace', 'D2C', 'Freemium', 'B2B', 'Other']

const REQUIRED_FIELDS = ['startupName', 'problem', 'targetCustomer', 'industry', 'geography']

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

export default function IdeaSubmitPage() {
  const navigate = useNavigate()

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

  const handleSubmit = () => {
    setSubmitted(true)

    const values = { startupName, problem, targetCustomer, industry, geography }
    const newErrors = {}

    REQUIRED_FIELDS.forEach((field) => {
      if (!values[field] || values[field].trim() === '') {
        newErrors[field] = true
      }
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    const saved = saveIdea({
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

    navigate(`/report?id=${saved.id}`)
  }

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }))
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-4rem)] bg-[#F8F9FA] px-4 py-8">
        <div className="mx-auto max-w-[680px]">
          {/* Page heading */}
          <h1 className="text-2xl font-bold text-gray-900">Submit your startup idea</h1>
          <p className="mb-8 mt-1 text-sm text-gray-500">
            The more specific you are, the better the AI analysis
          </p>

          {/* Card 1 — Basic information */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-base font-semibold text-gray-900">Basic information</h2>

            {/* Startup name */}
            <div className="mb-4">
              <label htmlFor="startupName" className="mb-1.5 block text-sm font-medium text-gray-700">
                Startup name
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
                placeholder="e.g., AcmeTech"
              />
              {errors.startupName && (
                <p className="mt-1 text-xs text-red-500">This field is required</p>
              )}
            </div>

            {/* Problem being solved */}
            <div className="mb-4">
              <label htmlFor="problem" className="mb-1.5 block text-sm font-medium text-gray-700">
                Problem being solved
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
                placeholder="Describe the core problem your startup addresses"
              />
              {errors.problem && (
                <p className="mt-1 text-xs text-red-500">This field is required</p>
              )}
            </div>

            {/* Target customer */}
            <div className="mb-4">
              <label htmlFor="targetCustomer" className="mb-1.5 block text-sm font-medium text-gray-700">
                Target customer
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
                placeholder="e.g., Small business owners, college students"
              />
              {errors.targetCustomer && (
                <p className="mt-1 text-xs text-red-500">This field is required</p>
              )}
            </div>

            {/* Industry & Geography side by side */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Industry */}
              <div>
                <label htmlFor="industry" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Industry
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
                      Select industry
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
                  Geography
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
                      Select geography
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
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-base font-semibold text-gray-900">Business details</h2>

            {/* Business model & Pricing side by side */}
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Business model */}
              <div>
                <label htmlFor="businessModel" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Business model
                </label>
                <div className="relative">
                  <select
                    id="businessModel"
                    className={selectNormal}
                    value={businessModel}
                    onChange={(e) => setBusinessModel(e.target.value)}
                  >
                    <option value="" disabled>
                      Select model
                    </option>
                    {BUSINESS_MODELS.filter(Boolean).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronIcon />
                </div>
              </div>

              {/* Pricing assumption */}
              <div>
                <label htmlFor="pricing" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Pricing assumption
                </label>
                <input
                  id="pricing"
                  type="text"
                  className={inputNormal}
                  value={pricing}
                  onChange={(e) => setPricing(e.target.value)}
                  placeholder="e.g., $10/month per user"
                />
              </div>
            </div>

            {/* Key assumptions */}
            <div className="mb-4">
              <label htmlFor="assumptions" className="mb-1.5 block text-sm font-medium text-gray-700">
                Key assumptions
              </label>
              <textarea
                id="assumptions"
                rows={2}
                className={inputNormal}
                value={assumptions}
                onChange={(e) => setAssumptions(e.target.value)}
                placeholder="List the key assumptions behind your idea"
              />
            </div>

            {/* Founder background */}
            <div>
              <label htmlFor="founderBg" className="mb-1.5 block text-sm font-medium text-gray-700">
                Founder background{' '}
                <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                id="founderBg"
                type="text"
                className={inputNormal}
                value={founderBg}
                onChange={(e) => setFounderBg(e.target.value)}
                placeholder="Brief background of the founding team"
              />
            </div>
          </div>

          {/* Bottom buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-[#534AB7] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#443DA0] focus:outline-none focus:ring-2 focus:ring-[#534AB7]/40 focus:ring-offset-2"
            >
              <SparkleIcon />
              Analyze with AI
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
