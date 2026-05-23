import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

import { getIdeas, getCurrentUser, seedSampleData, deleteIdea } from '../utils/storage'

const sidebarLinks = [
  {
    name: 'Dashboard',
    to: '/dashboard',
    active: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
  },
  {
    name: 'New Idea',
    to: '/submit',
    active: false,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: 'All Reports',
    to: '/dashboard',
    active: false,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    name: 'Compare Ideas',
    to: '/dashboard',
    active: false,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    name: 'Settings',
    to: '/dashboard',
    active: false,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

export default function DashboardPage() {
  const [activeMobileTab, setActiveMobileTab] = useState('dashboard')
  const [ideas, setIdeas] = useState([])
  const [user, setUser] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      const data = await getIdeas();
      setIdeas(data);
    };
    loadData();
    setUser(getCurrentUser());
  }, [])

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const handleSeed = async () => {
    const seeded = await seedSampleData();
    setIdeas(seeded);
    triggerToast('Seeded sample ideas!');
  }

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete all ideas?')) {
      for (const idea of ideas) {
        await deleteIdea(idea.id);
      }
      setIdeas([]);
      triggerToast('All ideas cleared!');
    }
  }

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteIdea(id);
    const data = await getIdeas();
    setIdeas(data);
    triggerToast('Idea deleted');
  }

  const handleFeaturePlaceholder = (e, featureName) => {
    e.preventDefault()
    triggerToast(`${featureName} feature coming soon in v2!`)
  }

  const name = user?.firstName || 'User'
  const recentIdeas = ideas.slice(-3).reverse()

  const totalCount = ideas.length
  const averageScore = totalCount
    ? Math.round(ideas.reduce((acc, curr) => acc + curr.score, 0) / totalCount)
    : 0
  const goCount = ideas.filter((i) => i.status === 'Go').length
  const plansCount = ideas.filter((i) => i.status === 'Go' || i.status === 'Pivot').length

  const statCards = [
    {
      label: 'Total Ideas Analyzed',
      value: totalCount,
      colorClass: 'text-[#534AB7]',
      bgClass: 'bg-[#534AB7]/10',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      label: 'Average Score',
      value: averageScore,
      colorClass: 'text-emerald-500',
      bgClass: 'bg-emerald-500/10',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: 'Go Recommendations',
      value: goCount,
      colorClass: 'text-emerald-500',
      bgClass: 'bg-emerald-500/10',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Validation Plans',
      value: plansCount,
      colorClass: 'text-amber-500',
      bgClass: 'bg-amber-500/10',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-[#F8F9FA] relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-4 z-50 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all animate-bounce">
          {toastMsg}
        </div>
      )}

      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-[220px] min-h-[calc(100vh-4rem)] border-r border-gray-200 bg-white px-4 py-6 hidden lg:block fixed left-0 top-16">
          <nav className="flex flex-col gap-1">
            {sidebarLinks.map((link) => {
              const isFeature = link.name === 'All Reports' || link.name === 'Compare Ideas' || link.name === 'Settings';
              return (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={(e) => isFeature && handleFeaturePlaceholder(e, link.name)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    link.active
                      ? 'bg-[#534AB7]/10 text-[#534AB7]'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-gray-200 my-4" />

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
              Recent
            </p>
            <div className="flex flex-col">
              {recentIdeas.map((idea) => (
                <Link
                  key={idea.id}
                  to={`/report?id=${idea.id}`}
                  className="text-sm text-gray-600 hover:text-[#534AB7] py-1.5 px-3 rounded-lg hover:bg-gray-50 truncate transition-colors"
                >
                  {idea.startupName}
                </Link>
              ))}
              {recentIdeas.length === 0 && (
                <p className="text-xs text-gray-400 italic px-3 py-1.5">No recent ideas</p>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:ml-[220px] flex-1 p-6 sm:p-8 bg-[#F8F9FA] min-h-[calc(100vh-4rem)] pb-24 lg:pb-8">
          {/* Greeting */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Good morning, {name}</h1>
            <p className="text-gray-500 text-sm mt-1">Here&#39;s your idea portfolio overview</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.bgClass} ${card.colorClass}`}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ideas Section */}
          <div className="flex items-center justify-between mt-8 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your startup ideas</h2>
            {ideas.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors focus:outline-none"
              >
                Clear all ideas
              </button>
            )}
          </div>

          {ideas.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center max-w-[500px] mx-auto my-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#534AB7]/10 text-[#534AB7] flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1.5">No ideas analyzed yet</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                Submit details about your startup concept to receive an AI validation plan, scorecard, and competitive research.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#534AB7] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4840a0] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Analyze new idea
                </Link>
                <button
                  onClick={handleSeed}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Seed sample ideas
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow relative group"
                >
                  <Link
                    to={`/report?id=${idea.id}`}
                    className="flex-1 flex items-center gap-4 cursor-pointer min-w-0"
                  >
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${idea.iconBg} ${idea.iconColor}`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{idea.startupName}</p>
                      <p className="text-xs text-gray-500">
                        {idea.industry} · {idea.geography}
                      </p>
                    </div>

                    {/* Score & Status */}
                    <div className="flex items-center gap-3 shrink-0 mr-2">
                      <span className="text-sm font-semibold text-gray-700">{idea.score}/100</span>
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${idea.statusClasses}`}
                      >
                        {idea.status}
                      </span>
                    </div>
                  </Link>

                  {/* Delete button (visible on hover) */}
                  <button
                    onClick={(e) => handleDelete(e, idea.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-all shrink-0 focus:outline-none focus:opacity-100"
                    title="Delete idea"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}


        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50" aria-label="Mobile navigation">
        <div className="flex items-center justify-around py-2">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs font-medium transition-colors ${
              activeMobileTab === 'dashboard' ? 'text-[#534AB7]' : 'text-gray-500'
            }`}
            onClick={() => setActiveMobileTab('dashboard')}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            Dashboard
          </Link>

          <Link
            to="/submit"
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs font-medium transition-colors ${
              activeMobileTab === 'new' ? 'text-[#534AB7]' : 'text-gray-500'
            }`}
            onClick={() => setActiveMobileTab('new')}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            New
          </Link>

          <button
            onClick={(e) => handleFeaturePlaceholder(e, 'All Reports')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs font-medium transition-colors ${
              activeMobileTab === 'reports' ? 'text-[#534AB7]' : 'text-gray-500'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Reports
          </button>

          <button
            onClick={(e) => handleFeaturePlaceholder(e, 'Settings')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs font-medium transition-colors ${
              activeMobileTab === 'settings' ? 'text-[#534AB7]' : 'text-gray-500'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </div>
      </nav>
    </div>
  )
}

