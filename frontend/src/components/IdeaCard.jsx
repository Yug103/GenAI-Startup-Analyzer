import { Link } from 'react-router-dom';
import Badge from './Badge';

export default function IdeaCard({ idea, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow relative group">
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
          <Badge text={idea.status} classes={idea.statusClasses} />
        </div>
      </Link>

      {/* Delete button (visible on hover) */}
      <button
        onClick={(e) => onDelete(e, idea.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-all shrink-0 focus:outline-none focus:opacity-100"
        title="Delete idea"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
