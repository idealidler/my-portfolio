// LandingPage.jsx
export default function LandingPage({ onSelect }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-200 via-pink-100 to-white p-8 text-center">
      <h1 className="text-5xl font-bold text-indigo-700 mb-8">Choose Your Experience</h1>
      <p className="max-w-lg mb-12 text-gray-700">
        Welcome! Select the version of this website that fits you best:
      </p>
      <div className="flex flex-col sm:flex-row gap-10">
        <button
          onClick={() => onSelect('recruiter')}
          className="px-10 py-6 bg-yellow-400 hover:bg-yellow-500 rounded-3xl shadow-lg font-semibold text-yellow-900 transition"
        >
          Recruiter Friendly<br />
          <small className="text-xs font-normal block mt-2 max-w-xs">
            Basic skills, job availability, work authorization checks
          </small>
        </button>
        <button
          onClick={() => onSelect('hiringManager')}
          className="px-10 py-6 bg-indigo-600 hover:bg-indigo-700 rounded-3xl shadow-lg font-semibold text-white transition"
        >
          Hiring Manager Friendly<br />
          <small className="text-xs font-normal block mt-2 max-w-xs">
            Detailed, technical, project-heavy experience
          </small>
        </button>
      </div>
    </div>
  );
}
