export default function MovieEmpty() {
  return (
    <div className="flex mt-10 flex-col items-center justify-center h-64 bg-slate-900 rounded-lg shadow-lg">
      <svg
        className="w-16 h-16 mb-4 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
        />
      </svg>
      <h3 className="mb-2 text-xl font-semibold text-gray-100">
        No Movies Found
      </h3>
      <p className="mb-4 text-sm text-gray-400 text-center">
        There are no movies in the current list.
        <br />
        Try adjusting your search or filters.
      </p>
    </div>
  );
}
