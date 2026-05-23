export default function Badge({ text, classes }) {
  const defaultClasses = 
    text === 'Go' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
    text === 'Pivot' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
    text === 'Stop' ? 'bg-red-50 text-red-700 border border-red-200' :
    'bg-gray-50 text-gray-700 border border-gray-200';

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${classes || defaultClasses}`}>
      {text}
    </span>
  );
}
