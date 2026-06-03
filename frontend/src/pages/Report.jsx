import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { getIdeaById, getIdeas } from '../utils/storage'
import { analyzeIdea, getReport } from '../services/api'

export default function ReportPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const id = searchParams.get('id')

  const [idea, setIdea] = useState(null)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const loadIdea = async () => {
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
          await analyzeIdea(found.id)
          const reportRes = await getReport(found.id)
          setReport(reportRes.data)
        }
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError(err.message || "Analysis failed, try again")
        setLoading(false)
      }
    }
    loadIdea()
  }, [id])

  const [activeSection, setActiveSection] = useState('summary')

  const sectionRefs = {
    summary: useRef(null),
    scores: useRef(null),
    strengths: useRef(null),
    weaknesses: useRef(null),
    competitors: useRef(null),
    risks: useRef(null),
  }

  const sidebarLinks = [
    { label: 'Analysis Summary', id: 'summary' },
    { label: 'Category Scores', id: 'scores' },
    { label: 'Strengths & Weaknesses', id: 'strengths' },
    { label: 'Competitors', id: 'competitors' },
    { label: 'Risks & Next Steps', id: 'risks' },
  ]

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId)
    sectionRefs[sectionId]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Navbar showNewIdea={false} onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex flex-col justify-center items-center p-6 text-center min-h-[calc(100vh-4rem)]">
          <div className="w-12 h-12 border-4 border-[#534AB7] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 text-sm">AI is analyzing your idea...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Navbar showNewIdea={false} onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex flex-col justify-center items-center p-6 text-center min-h-[calc(100vh-4rem)]">
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
        <Navbar showNewIdea={false} onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex flex-col justify-center items-center p-6 text-center min-h-[calc(100vh-4rem)]">
          <h2 className="text-xl font-bold text-gray-900 mb-2">No active report found</h2>
          <p className="text-gray-500 mb-4 text-sm">Please submit a startup idea first to generate a report scorecard.</p>
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

  const {
    startupName,
    industry,
    geography,
    date,
    marketSize,
    mvpEffortMonths
  } = idea

  const {
    overall_score = 0,
    recommendation = '',
    category_scores = {},
    strengths = [],
    weaknesses = [],
    risks = [],
    competitors = [],
    market_insights = '',
    next_steps = []
  } = report || {}

  const competitorCount = competitors.length
  const directCount = competitors.filter(c => (c.type || '').toLowerCase() === 'direct').length
  const indirectCount = competitorCount - directCount

  const getThreatBadge = (threat) => {
    const t = (threat || '').toLowerCase()
    if (t === 'high') return 'bg-red-50 text-red-700 border-red-200'
    if (t === 'medium') return 'bg-amber-50 text-amber-700 border-amber-200'
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }

  const getRecStyles = () => {
    const status = (recommendation || '').toLowerCase()
    if (status === 'stop') {
      return { box: 'bg-red-50 border-red-200', icon: 'text-red-600', text: 'text-red-700', desc: 'text-red-600', isStop: true }
    }
    if (status === 'pivot') {
      return { box: 'bg-amber-50 border-amber-200', icon: 'text-amber-600', text: 'text-amber-700', desc: 'text-amber-600', isStop: false }
    }
    return { box: 'bg-emerald-50 border-emerald-200', icon: 'text-emerald-600', text: 'text-emerald-700', desc: 'text-emerald-600', isStop: false }
  }

  const getEffortLabel = (months) => {
    if (!months) return 'Medium'
    if (months <= 2) return 'Low'
    if (months <= 5) return 'Medium'
    return 'High'
  }

  const recStyles = getRecStyles()

  const sidebarContent = (
    <div className="px-5 py-5">
      <h2 className="text-lg font-bold text-gray-900 mt-1 truncate" title={startupName}>
        {startupName}
      </h2>
      <p className="text-xs font-semibold text-[#534AB7] uppercase tracking-wider mt-1">
        {industry}
      </p>
      <p className="text-xs text-gray-400 mt-2">
        AI validation complete. Generated on {date || 'recently'}.
      </p>

      {/* Recommendation box */}
      <div className={`mt-4 rounded-lg border p-3 ${recStyles.box}`}>
        <div className="flex items-center gap-2">
          <svg className={`w-4 h-4 ${recStyles.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            {recStyles.isStop ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            )}
          </svg>
          <span className={`text-sm font-bold capitalize ${recStyles.text}`}>
            Recommendation: {recommendation}
          </span>
        </div>
        <p className={`text-xs mt-1 ${recStyles.desc}`}>
          {market_insights}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-5" />

      {/* Section navigation */}
      <nav className="space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = activeSection === link.id
          return (
            <button
              key={link.id}
              onClick={() => handleSectionClick(link.id)}
              className={`block w-full text-left text-sm py-2 transition-colors ${
                isActive
                  ? 'text-[#534AB7] font-medium border-l-2 border-[#534AB7] pl-3'
                  : 'text-gray-500 hover:text-gray-700 pl-3'
              }`}
            >
              {link.label}
            </button>
          )
        })}
      </nav>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar showNewIdea={false} onMenuClick={() => setSidebarOpen(true)}>
        <button
          onClick={() => alert('📄 Export PDF coming in the next update')}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">Export PDF</span>
        </button>
      </Navbar>

      <div className="flex">
        {/* Sidebar with custom report content */}
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
          {sidebarContent}
        </Sidebar>

        {/* Main content */}
        <main className="lg:ml-[200px] flex-1 p-4 sm:p-6 md:p-8 min-h-[calc(100vh-4rem)]">
          {/* Analysis Summary section ref */}
          <div ref={sectionRefs.summary} />

          {/* Metric cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Overall Score - PURPLE */}
            <div className="bg-[#534AB7] text-white rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
                <p className="text-sm opacity-90">Overall Score</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-bold">{overall_score}</span>
                <span className="text-sm opacity-80">/100</span>
              </div>
            </div>

            {/* Card 2: Est. Market Size */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <p className="text-sm text-gray-500">Market Size</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">${marketSize}</p>
            </div>

            {/* Card 3: Competitors Found */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-sm text-gray-500">Competitors</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{competitorCount}</p>
              <p className="text-xs text-gray-400 mt-1">{directCount} direct, {indirectCount} indirect</p>
            </div>

            {/* Card 4: MVP Effort Level */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <p className="text-sm text-gray-500">MVP Effort</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{getEffortLabel(mvpEffortMonths)}</p>
            </div>
          </div>

          {/* Category Scores Section */}
          <section className="mt-8" ref={sectionRefs.scores}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Scores</h3>
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <div className="space-y-1">
                {Object.entries(category_scores).map(([key, score], i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-4 py-2">
                    <span className="w-[120px] sm:w-[180px] text-xs sm:text-sm text-gray-600 shrink-0 capitalize">{key.replace(/_/g, ' ')}</span>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2D2B6B] rounded-full transition-all duration-500"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm font-semibold text-gray-700">{score}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Key Strengths & Weaknesses (side by side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Key Strengths */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5" ref={sectionRefs.strengths}>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <h4 className="text-base sm:text-lg font-semibold text-emerald-700">Key Strengths</h4>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {strengths && strengths.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <p className="text-sm text-gray-900">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Weaknesses */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5" ref={sectionRefs.weaknesses}>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h4 className="text-base sm:text-lg font-semibold text-red-600">Key Weaknesses</h4>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {weaknesses && weaknesses.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    <p className="text-sm text-gray-900">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Risks */}
          <section className="mt-6" ref={sectionRefs.risks}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Risks</h3>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
              <div className="space-y-3 sm:space-y-4">
                {risks && risks.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
                      </svg>
                    </span>
                    <p className="text-sm text-gray-900">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Top Competitors Table */}
          <section className="mt-6" ref={sectionRefs.competitors}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Competitors</h3>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 sm:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 sm:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 sm:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Pricing</th>
                    <th className="px-4 sm:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Threat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {competitors && competitors.map((c, i) => (
                    <tr key={i}>
                      <td className="px-4 sm:px-5 py-3 sm:py-4 text-sm font-medium text-gray-900">{c.name}</td>
                      <td className="px-4 sm:px-5 py-3 sm:py-4 text-sm text-gray-600 capitalize">{c.type}</td>
                      <td className="px-4 sm:px-5 py-3 sm:py-4 text-sm text-gray-600 hidden sm:table-cell">{c.pricing}</td>
                      <td className="px-4 sm:px-5 py-3 sm:py-4 text-sm">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getThreatBadge(c.threat_level)}`}>
                          {c.threat_level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Next Steps Section */}
          <section className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Next Steps</h3>
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <ol className="list-decimal pl-5 space-y-3 text-sm text-gray-700">
                {next_steps && next_steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </section>

          {/* Bottom Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Back to Dashboard
            </Link>
            <Link
              to={`/validation-plan?id=${idea.id}`}
              className="inline-flex items-center justify-center rounded-lg bg-[#534AB7] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#463faa] transition"
            >
              Generate Validation Plan →
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
