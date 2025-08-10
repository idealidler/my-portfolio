export default function RecruiterFriendly({ switchVersion }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-50 to-white px-6 text-center relative">
      <h1 className="text-5xl font-bold text-yellow-600 mb-6">🚧 Under Construction 🚧</h1>
      <p className="text-lg text-yellow-800 max-w-xl mb-8">
        This Recruiter Friendly version is coming soon! In the meantime, feel free to enjoy this little joke:
      </p>
      <p className="text-2xl italic text-yellow-700 mb-4">Why did the developer go broke? Because he used up all his cache! 💸😄</p>
      <p className="text-yellow-600 mt-4">Stay tuned — exciting things are on the way!</p>

      {/* Switch button */}
      <button
        onClick={switchVersion}
        className="absolute top-6 right-6 px-4 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition"
      >
        Switch to Hiring Manager Version
      </button>
    </div>
  );
}
