import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getIdeaById, getIdeas } from '../utils/storage'

export default function ReportPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const id = searchParams.get('id')

  let idea = getIdeaById(id)
  if (!idea) {
    const all = getIdeas()
    if (all.length > 0) {
      idea = all[0]
    }
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

  const [activeSection, setActiveSection] = useState('scorecard')

  const sidebarLinks = [
    { label: 'Scorecard', id: 'scorecard' },
    { label: 'Competitors', id: 'competitors' },
    { label: 'Market Trends', id: 'trends' },
    { label: 'Validation Plan', id: 'validation', to: `/validation-plan?id=${idea.id}` },
  ]

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


  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar>
        <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
          Export PDF
        </button>
      </Navbar>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[260px] fixed left-0 top-16 min-h-[calc(100vh-4rem)] border-r border-gray-200 bg-white px-5 py-6">
          <h2 className="text-lg font-bold text-gray-900 truncate" title={startupName}>{startupName}</h2>
          <p className="text-sm text-gray-500">{industry} · {geography}</p>
          <p className="text-xs text-gray-400 mt-1">Submitted {date || 'recently'}</p>

          {/* Recommendation box */}
          <div className={`mt-4 rounded-lg border p-3 ${
            recommendationStatus.includes('Proceed') 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
              : recommendationStatus.includes('Stop') 
                ? 'bg-red-50 border-red-200 text-red-700' 
                : 'bg-amber-50 border-amber-200 text-amber-700'
          }`}>
            <div className="flex items-center gap-2">
              <svg className={`w-4 h-4 ${
                recommendationStatus.includes('Proceed') 
                  ? 'text-emerald-600' 
                  : recommendationStatus.includes('Stop') 
                    ? 'text-red-600' 
                    : 'text-amber-600'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                {recommendationStatus.includes('Stop') ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                )}
              </svg>
              <span className="text-sm font-semibold">{recommendationStatus}</span>
            </div>
            <p className={`text-xs mt-1 ${
              recommendationStatus.includes('Proceed') 
                ? 'text-emerald-600' 
                : recommendationStatus.includes('Stop') 
                  ? 'text-red-600' 
                  : 'text-amber-600'
            }`}>{recommendationDesc}</p>
          </div>

          <div className="border-t border-gray-200 my-5" />

          {/* Section navigation */}
          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = activeSection === link.id
              const className = isActive
                ? 'block bg-[#534AB7]/10 text-[#534AB7] font-medium rounded-lg px-3 py-2 text-sm'
                : 'block text-gray-600 hover:bg-gray-100 rounded-lg px-3 py-2 text-sm'

              if (link.to) {
                return (
                  <Link key={link.id} to={link.to} className={className}>
                    {link.label}
                  </Link>
                )
              }

              return (
                <button
                  key={link.id}
                  onClick={() => setActiveSection(link.id)}
                  className={`${className} w-full text-left`}
                >
                  {link.label}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="lg:ml-[260px] flex-1 p-6 sm:p-8 bg-[#F8F9FA] min-h-[calc(100vh-4rem)]">
          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-3xl font-bold text-[#534AB7]">{score}</p>
              <p className="text-sm text-gray-500 mt-1">Overall Score</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-2xl font-bold text-gray-900">${marketSize}</p>
              <p className="text-sm text-gray-500 mt-1">Market Size</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{competitorCount}</p>
              <p className="text-sm text-gray-500 mt-1">Competitors Found</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{mvpEffortMonths} months</p>
              <p className="text-sm text-gray-500 mt-1">MVP Effort</p>
            </div>
          </div>

          {/* Category scores */}
          <section className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category scores</h3>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tickCount={6} />
                  <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 13 }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#534AB7" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Strengths & Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Strengths */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-100">
                <h4 className="text-sm font-semibold text-emerald-800">Strengths</h4>
              </div>
              <div className="p-5 space-y-3">
                {strengths.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <p className="text-sm text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Risks */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-red-50 px-5 py-3 border-b border-red-100">
                <h4 className="text-sm font-semibold text-red-800">Risks</h4>
              </div>
              <div className="p-5 space-y-3">
                {risks.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    <p className="text-sm text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competitors table */}
          <section className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top competitors found</h3>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pricing</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Threat Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {competitors.map((c, i) => (
                    <tr key={i}>
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">{c.name}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{c.type}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{c.pricing}</td>
                      <td className="px-5 py-4 text-sm">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${c.color}`}>
                          {c.threat}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bottom action buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/validation-plan?id=${idea.id}`}
              className="inline-flex items-center rounded-lg bg-[#534AB7] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4740a0] transition"
            >
              Generate validation plan
            </Link>
            <Link
              to="/dashboard"
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition inline-flex items-center justify-center"
            >
              Back to dashboard
            </Link>
            <button className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
              Export PDF
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
