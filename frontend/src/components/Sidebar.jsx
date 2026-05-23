import { Link } from 'react-router-dom';

export default function Sidebar({ recentIdeas = [], activeLink = 'Dashboard', onFeatureClick, children }) {
  const sidebarLinks = [
    {
      name: 'Dashboard',
      to: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
      ),
    },
    {
      name: 'New Idea',
      to: '/submit',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'All Reports',
      to: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: 'Compare Ideas',
      to: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
    {
      name: 'Settings',
      to: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-[220px] min-h-[calc(100vh-4rem)] border-r border-gray-200 bg-white px-4 py-6 hidden lg:block fixed left-0 top-16">
      {children ? children : (
        <>
          <nav className="flex flex-col gap-1">
            {sidebarLinks.map((link) => {
              const isFeature = link.name === 'All Reports' || link.name === 'Compare Ideas' || link.name === 'Settings';
              const isActive = activeLink === link.name;
              return (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={(e) => {
                    if (isFeature && onFeatureClick) {
                      onFeatureClick(e, link.name);
                    }
                  }}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#534AB7]/10 text-[#534AB7]'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              );
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
        </>
      )}
    </aside>
  );
}
