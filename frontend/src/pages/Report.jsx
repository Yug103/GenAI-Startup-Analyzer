import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { getIdeaById, getIdeas } from '../utils/storage'

export default function ReportPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const id = searchParams.get('id')

  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadIdea = async () => {
      let found = await getIdeaById(id)
      if (!found) {
        const all = await getIdeas()
        if (all.length > 0) {
          found = all[0]
        }
      }
      setIdea(found)
      setLoading(false)
    }
    loadIdea()
  }, [id])

  const [activeSection, setActiveSection] = useState('summary')

  // Section refs for scroll-into-view
  const sectionRefs = {
    summary: useRef(null),
    scores: useRef(null),
    strengths: useRef(null),
    competitors: useRef(null),
    risks: useRef(null),
  }

  const sidebarLinks = [
    { label: 'Analysis Summary', id: 'summary' },
    { label: 'Category Scores', id: 'scores' },
    { label: 'Key Strengths', id: 'strengths' },
    { label: 'Competitors Landscape', id: 'competitors' },
    { label: 'Margins & Risks', id: 'risks' },
  ]

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId)
    sectionRefs[sectionId]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Helper: split a strength/risk string into title + description
  const splitTitleDesc = (text) => {
    if (!text) return { title: '', desc: '' }
    // Try splitting on first period, colon, or dash followed by a space
    const match = text.match(/^(.+?)[.:\-–—]\s+(.+)$/)
    if (match) return { title: match[1], desc: match[2] }
    // Fallback: first 6 words as title, rest as desc
    const words = text.split(' ')
    if (words.length <= 6) return { title: text, desc: '' }
    return { title: words.slice(0, 6).join(' '), desc: words.slice(6).join(' ') }
  }

  // Helper: map mvpEffortMonths to effort label
  const getEffortLabel = (months) => {
    if (!months) return 'Medium'
    if (months <= 2) return 'Low'
    if (months <= 5) return 'Medium'
    return 'High'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-[#534AB7] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 text-sm">Loading your report analysis...</p>
      </div>
    )
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">No active report found</h2>
        <p className="text-gray-500 mb-4 text-sm">Please submit a startup idea first to generate a report scorecard.</p>
        <button
          onClick={() => navigate('/submit')}
          className="bg-[#534AB7] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#4840a0] transition-colors"
        >
          Submit your first idea
        </button>
      </div>
    )
  }

  const {
    startupName,
    industry,
    geography,
    date,
    recommendationStatus,
    recommendationDesc,
    score,
    marketSize,
    competitorCount,
    mvpEffortMonths,
    categoryData,
    strengths,
    risks,
    competitors
  } = idea

  // Threat level badge classes
  const getThreatBadge = (threat) => {
    const t = (threat || '').toLowerCase()
    if (t === 'high') return 'bg-red-50 text-red-700 border-red-200'
    if (t === 'medium') return 'bg-amber-50 text-amber-700 border-amber-200'
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }

  // Recommendation styling
  const getRecStyles = () => {
    const status = recommendationStatus || ''
    if (status.toLowerCase().includes('stop')) {
      return {
        box: 'bg-red-50 border-red-200',
        icon: 'text-red-600',
        text: 'text-red-700',
        desc: 'text-red-600',
        isStop: true,
      }
    }
    if (status.toLowerCase().includes('caution')) {
      return {
        box: 'bg-amber-50 border-amber-200',
        icon: 'text-amber-600',
        text: 'text-amber-700',
        desc: 'text-amber-600',
        isStop: false,
      }
    }
    return {
      box: 'bg-emerald-50 border-emerald-200',
      icon: 'text-emerald-600',
      text: 'text-emerald-700',
      desc: 'text-emerald-600',
      isStop: false,
    }
  }

  const recStyles = getRecStyles()

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar showNewIdea={false}>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export PDF
        </button>
      </Navbar>

      <div className="flex">
        {/* Sidebar with custom report content */}
        <Sidebar>
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
                <span className={`text-sm font-bold ${recStyles.text}`}>
                  Recommendation: {recommendationStatus}
                </span>
              </div>
              <p className={`text-xs mt-1 ${recStyles.desc}`}>
                {recommendationDesc}
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
        </Sidebar>

        {/* Main content */}
        <main className="lg:ml-[200px] flex-1 p-6 sm:p-8 min-h-[calc(100vh-4rem)]">
          {/* Analysis Summary section ref */}
          <div ref={sectionRefs.summary} />

          {/* Metric cards - 4 in a row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Card 1: Overall Score - PURPLE */}
            <div className="bg-[#534AB7] text-white rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                {/* Bullseye / Target icon */}
                <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
                <p className="text-sm opacity-90">Overall Score</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{score}</span>
                <span className="text-sm opacity-80">/100</span>
              </div>
            </div>

            {/* Card 2: Est. Market Size */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <p className="text-sm text-gray-500">Est. Market Size</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">${marketSize}</p>
              <div className="flex items-center gap-1 mt-1">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-xs text-emerald-600 font-medium">+12% YoY</span>
              </div>
            </div>

            {/* Card 3: Competitors Found */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-sm text-gray-500">Competitors Found</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{competitorCount}</p>
              <p className="text-xs text-gray-400 mt-1">3 direct, 9 indirect</p>
            </div>

            {/* Card 4: MVP Effort Level */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <p className="text-sm text-gray-500">MVP Effort Level</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{getEffortLabel(mvpEffortMonths)}</p>
              <p className="text-xs text-gray-400 mt-1">~4-6 weeks to build</p>
            </div>
          </div>

          {/* Category Scores Section */}
          <section className="mt-8" ref={sectionRefs.scores}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Scores</h3>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="space-y-1">
                {categoryData && categoryData.map((cat, i) => (
                  <div key={i} className="flex items-center gap-4 py-2">
                    <span className="w-[180px] text-sm text-gray-600 shrink-0">{cat.name}</span>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2D2B6B] rounded-full transition-all duration-500"
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm font-semibold text-gray-700">{cat.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Key Strengths & Primary Risks (side by side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Key Strengths */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5" ref={sectionRefs.strengths}>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <h4 className="text-lg font-semibold text-emerald-700">Key Strengths</h4>
              </div>
              <div className="space-y-4">
                {strengths && strengths.map((item, i) => {
                  const { title, desc } = splitTitleDesc(item)
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{title}</p>
                        {desc && <p className="text-sm text-gray-500 mt-0.5">{desc}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Primary Risks */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5" ref={sectionRefs.risks}>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h4 className="text-lg font-semibold text-red-600">Primary Risks</h4>
              </div>
              <div className="space-y-4">
                {risks && risks.map((item, i) => {
                  const { title, desc } = splitTitleDesc(item)
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{title}</p>
                        {desc && <p className="text-sm text-gray-500 mt-0.5">{desc}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Top Competitors Table */}
          <section className="mt-6" ref={sectionRefs.competitors}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Competitors</h3>
              <button className="text-sm text-[#534AB7] font-medium hover:underline">
                View All {competitorCount}
              </button>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pricing Model</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Threat Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {competitors && competitors.map((c, i) => (
                    <tr key={i}>
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">{c.name}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{c.type}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{c.pricing}</td>
                      <td className="px-5 py-4 text-sm">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getThreatBadge(c.threat)}`}>
                          {c.threat}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bottom Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-3 justify-end">
            <Link
              to="/dashboard"
              className="inline-flex items-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Back to Dashboard
            </Link>
            <Link
              to={`/validation-plan?id=${idea.id}`}
              className="inline-flex items-center rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-600 transition"
            >
              Generate Validation Plan
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
