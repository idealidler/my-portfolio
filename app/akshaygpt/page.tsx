import { AkshayGptShell } from "@/components/chat/akshay-gpt-shell";
import { Footer } from "@/components/site/footer";
import { PageShell } from "@/components/site/page-shell";

export default function AkshayGptPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        <div className="surface rounded-[2rem] px-6 py-8 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
            AI experience
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            AkshayGPT now runs on a structured portfolio context and `gpt-4o-mini`.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            This workspace now shares the same source of truth as the homepage, featured projects,
            and career summary, so answers stay aligned with the actual portfolio content.
          </p>
        </div>
      </section>
      <AkshayGptShell />
      <Footer />
    </PageShell>
  );
}
