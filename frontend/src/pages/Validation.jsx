import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { getIdeaById, getIdeas, getCurrentUser } from '../utils/storage'
import { generateValidation, getValidation } from '../services/api'

const tabs = [
  { key: 'plan', label: '7-Day Plan' },
  { key: 'interview', label: 'Interview Questions' },
  { key: 'email', label: 'Cold Email' },
  { key: 'mvp', label: 'MVP Test Plan' },
]

const ValidationPlanPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const id = searchParams.get('id')

  const [idea, setIdea] = useState(null)
  const [validationData, setValidationData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        let found = await getIdeaById(id)
        if (!found) {
          const all = await getIdeas()
          if (all.length > 0) {
            found = all[0]
          }
        }
        setIdea(found)
        
        if (found) {
          try {
            const valRes = await getValidation(found.id)
            setValidationData(valRes.data)
          } catch (e) {
            // Not generated yet, will show button
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  const handleGenerate = async () => {
    try {
      setGenerating(true)
      await generateValidation(idea.id)
      const res = await getValidation(idea.id)
      setValidationData(res.data)
    } catch (err) {
      console.error(err)
      setError(err.message || "Failed to generate plan.")
    } finally {
      setGenerating(false)
    }
  }

  const user = getCurrentUser()
  const userName = user ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Founder'

  const [activeTab, setActiveTab] = useState('plan')
  const [copied, setCopied] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="Validation Reports" />
        <div className="lg:ml-[200px] flex flex-col justify-center items-center p-6 text-center min-h-[calc(100vh-4rem)]">
          <div className="w-12 h-12 border-4 border-[#534AB7] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (generating) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="Validation Reports" />
        <div className="lg:ml-[200px] flex flex-col justify-center items-center p-6 text-center min-h-[calc(100vh-4rem)]">
          <div className="w-12 h-12 border-4 border-[#534AB7] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 text-sm">Generating your validation plan...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="Validation Reports" />
        <div className="lg:ml-[200px] flex flex-col justify-center items-center p-6 text-center min-h-[calc(100vh-4rem)]">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-red-500 mb-4 text-sm max-w-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#534AB7] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#4840a0] transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="Validation Reports" />
        <div className="lg:ml-[200px] flex flex-col justify-center items-center p-6 text-center min-h-[calc(100vh-4rem)]">
          <h2 className="text-xl font-bold text-gray-900 mb-2">No active idea found</h2>
          <p className="text-gray-500 mb-4 text-sm">Please submit a startup idea first to generate a validation plan.</p>
          <button
            onClick={() => navigate('/submit')}
            className="bg-[#534AB7] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#4840a0] transition-colors"
          >
            Submit your first idea
          </button>
        </div>
      </div>
    )
  }

  if (!validationData) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="Validation Reports" />
        <main className="lg:ml-[200px] flex-1 py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No Validation Plan Yet</h2>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            You haven't generated a validation plan for <strong>{idea.startupName}</strong> yet. Click below to let AI create a tailored strategy.
          </p>
          <button
            onClick={handleGenerate}
            className="bg-[#534AB7] text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-[#4840a0] transition-colors text-lg"
          >
            Generate Validation Plan
          </button>
        </main>
      </div>
    )
  }

  const { startupName } = idea
  const {
    seven_day_plan = [],
    interview_questions = [],
    cold_email = {},
    mvp_test_plan = {},
    success_metrics = []
  } = validationData

  const customizedEmail = (cold_email.body || '').replace('[Your Name]', userName)
  const emailParagraphs = customizedEmail.split('\n\n')
  const subjectText = cold_email.subject || ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(customizedEmail)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback silently
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar onMenuClick={() => setSidebarOpen(true)}>
        <button
          onClick={() => alert('📄 Export PDF coming in the next update')}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md active:scale-[0.97]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="hidden sm:inline">Export PDF</span>
        </button>
      </Navbar>

      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="Validation Reports" />

      <main className="lg:ml-[200px] flex-1 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto">
          {/* Page Heading */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Validation Plan</h1>
            <p className="text-base sm:text-lg text-gray-700 mt-1">{startupName}</p>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" />
              </svg>
              Generated by AI · 7-day action plan
            </p>
          </div>

          {/* Success Metrics Summary */}
          <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-emerald-800 mb-2">Key Success Metrics</h3>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-emerald-700">
              {success_metrics.map((metric, i) => (
                <li key={i}>{metric}</li>
              ))}
            </ol>
          </div>

          {/* Tab Bar */}
          <div className="mt-6 mb-6 sm:mb-8 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="inline-flex rounded-lg bg-gray-100 p-1 border border-gray-200 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={
                    activeTab === tab.key
                      ? 'bg-white text-gray-900 shadow-sm border border-gray-200 rounded-md px-3 sm:px-4 py-2 text-sm font-medium whitespace-nowrap'
                      : 'text-gray-500 hover:text-gray-700 rounded-md px-3 sm:px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap'
                  }
                  aria-selected={activeTab === tab.key}
                  role="tab"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab 1 — 7-Day Plan */}
          {activeTab === 'plan' && (
            <div className="space-y-3 sm:space-y-4">
              {seven_day_plan.map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm flex gap-3 sm:gap-4">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${
                    item.day <= 5 ? 'bg-[#534AB7]' : 'bg-emerald-500'
                  }`}>
                    {item.day}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.description}</p>
                    {item.action && (
                      <p className="text-sm text-[#534AB7] font-medium mt-2">Action: {item.action}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2 — Interview Questions */}
          {activeTab === 'interview' && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Customer interview questions</h2>
              <div>
                {interview_questions.map((question, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg px-4 py-3 mb-3 text-sm text-gray-700 leading-relaxed border border-gray-100">
                    {question}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3 — Cold Email */}
          {activeTab === 'email' && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-900 mb-4">
                <span className="text-gray-500">Subject: </span>
                {subjectText}
              </p>
              <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                {emailParagraphs.map((para, index) => (
                  <p key={index} className="whitespace-pre-line">{para}</p>
                ))}
              </div>
              <div className="mt-4">
                <button
                  onClick={handleCopy}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {copied ? 'Copied!' : 'Copy to clipboard'}
                </button>
              </div>
            </div>
          )}

          {/* Tab 4 — MVP Test Plan */}
          {activeTab === 'mvp' && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-5">MVP testing roadmap</h2>
              <div className="space-y-4">
                <div className="flex gap-3 sm:gap-4 items-start">
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5 bg-[#534AB7]/10 text-[#534AB7]">Week 1</span>
                  <p className="text-sm text-gray-600 mt-1">{mvp_test_plan.week1}</p>
                </div>
                <div className="flex gap-3 sm:gap-4 items-start">
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5 bg-[#534AB7]/10 text-[#534AB7]">Week 2</span>
                  <p className="text-sm text-gray-600 mt-1">{mvp_test_plan.week2}</p>
                </div>
                <div className="flex gap-3 sm:gap-4 items-start">
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5 bg-amber-100 text-amber-700 whitespace-nowrap">Success</span>
                  <p className="text-sm text-gray-600 mt-1">{mvp_test_plan.success_metric}</p>
                </div>
                <div className="flex gap-3 sm:gap-4 items-start">
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5 bg-red-100 text-red-700 whitespace-nowrap">Kill</span>
                  <p className="text-sm text-gray-600 mt-1">{mvp_test_plan.kill_condition}</p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
            <Link
              to={`/report?id=${idea.id}`}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              ← Back to Report
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-[#534AB7] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#463faa] transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ValidationPlanPage
