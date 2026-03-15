export function Footer() {
  return (
    <footer className="px-4 pb-10 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200/70 bg-white/70 px-6 py-5 text-sm text-slate-500 backdrop-blur">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>Akshay Jain © {new Date().getFullYear()}</p>
          <p>Built as a premium SaaS-style portfolio with an AI-first experience.</p>
        </div>
      </div>
    </footer>
  );
}
