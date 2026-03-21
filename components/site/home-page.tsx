import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Download,
  ExternalLink,
  Github,
  Mail,
  MapPin,
  MoveRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  audiencePaths,
  contactLinks,
  education,
  experience,
  featuredProjects,
  heroStats,
  highlights,
  profileNarratives,
  recruiterSignals,
  selectedAnalysisProjects,
  skillGroups,
} from "@/data/portfolio";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

function ProjectAccent({ slug }: { slug: string }) {
  const accents: Record<string, string> = {
    "h1b-wage-map": "from-sky-200 via-cyan-200 to-teal-200",
    "gitdecode-backend": "from-slate-300 via-sky-200 to-cyan-100",
    "net-worth-tracker": "from-emerald-200 via-teal-100 to-cyan-100",
    "stock-sentiment-dashboard": "from-indigo-200 via-sky-100 to-violet-100",
    "starbucks-drink-recommendation": "from-rose-500 via-orange-400 to-yellow-300",
    "ecommerce-customer-purchase-analysis": "from-violet-500 via-fuchsia-500 to-pink-300",
  };

  return (
    <div className={cn("h-full w-full bg-gradient-to-br", accents[slug] ?? "from-sky-500 to-slate-950")} />
  );
}

export function HomePage() {
  const tickerSignals = [...recruiterSignals, ...recruiterSignals];

  return (
    <div className="px-4 pb-12 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl pt-4">
        <div className="surface-strong ticker-mask rounded-full px-4 py-3 sm:px-5">
          <div className="ticker-track gap-3">
            {tickerSignals.map((signal, index) => (
              <div
                key={`${signal}-${index}`}
                className="flex shrink-0 items-center gap-3 rounded-full border border-sky-100 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700"
              >
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                <span>{signal}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 pb-18 pt-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:pb-24 lg:pt-16">
        <div className="surface relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="hero-orb hero-orb-one -left-10 -top-10" />
          <div className="hero-orb hero-orb-three right-1/3 top-12" />
          <div className="bg-shimmer absolute inset-x-0 top-0 h-px animate-shimmer" />
          <Badge className="border-sky-100 bg-sky-50 text-sky-700">
            Analytics engineering, BI systems, and data products in one portfolio surface
          </Badge>
          <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            I build reporting systems and data products that make complex decisions easier to act on.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            My work spans enterprise analytics engineering, productized dashboards, ETL pipelines,
            and user-facing data applications. This portfolio brings together measurable business
            impact, newer GitHub builds, and an AI guide that speaks from the same structured source of truth.
          </p>

          <div className="mt-8 rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Why teams hire me
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {highlights.slice(0, 2).map((item) => (
                <div key={item.title} className="rounded-[1.25rem] border border-slate-200/70 bg-white/85 p-4">
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#projects" className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>
              Explore featured work
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/akshaygpt" className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
              <Sparkles className="mr-2 h-4 w-4" />
              Launch AkshayGPT
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.5rem] border border-white/60 bg-white/80 p-5 shadow-card transition duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-full border border-emerald-200 bg-emerald-50 p-2 text-emerald-700">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    Impact
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
                <p className="mt-5 text-3xl font-semibold text-slate-950">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-slate-700">{stat.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="surface rounded-[2rem] p-6 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Based in Philadelphia
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Akshay Jain</h2>
            <p className="text-base text-slate-600">Analytics Engineer and Data Product Builder</p>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-sky-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Best fit
            </p>
            <div className="mt-4 space-y-3">
              {[
                "Analytics engineering roles with strong stakeholder ownership",
                "BI teams modernizing from reporting into reusable semantic models",
                "Product-minded data roles that need both execution and business communication",
              ].map((item) => (
                <p key={item} className="text-sm leading-6 text-slate-700">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Working style</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{profileNarratives.workStyle.body}</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Career direction</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{profileNarratives.careerGoals.body}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a href={contactLinks.resume} className={cn(buttonVariants({ variant: "secondary" }), "justify-center")}>
              <Download className="mr-2 h-4 w-4" />
              Resume
            </a>
            <a
              href={contactLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "ghost" }), "justify-center rounded-full border border-slate-200 bg-white/70")}
            >
              LinkedIn
            </a>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-slate-900/90 bg-slate-950 p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
              Current positioning
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{profileNarratives.problemSolving.body}</p>
          </div>
        </aside>
      </section>

      <section id="proof" className="mx-auto max-w-7xl scroll-mt-28 py-10 sm:py-12">
        <SectionHeading
          eyebrow="Why this format works"
          title="Recruiter clarity, hiring-manager depth, and AI-assisted exploration in one product"
          description="Instead of splitting the portfolio into disconnected experiences, the site now tells one clearer story with tailored entry points and shared data underneath."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {audiencePaths.map((path) => (
            <Link
              key={path.title}
              href={path.href}
              className="surface group rounded-[2rem] p-6 transition duration-200 hover:-translate-y-1"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                {path.eyebrow}
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-950">{path.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{path.description}</p>
              <div className="mt-8 flex items-center text-sm font-medium text-slate-950">
                {path.cta}
                <MoveRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="experience" className="mx-auto max-w-7xl scroll-mt-28 py-10 sm:py-12">
        <SectionHeading
          eyebrow="Career history"
          title="Enterprise delivery depth first, with independent product building alongside it"
          description="The strongest signal in this portfolio is Holman: owning modern BI systems, operational analytics, stakeholder alignment, and adoption at enterprise scale."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            {experience.map((item) => (
              <article key={`${item.company}-${item.role}`} className="surface rounded-[2rem] p-6 sm:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
                      {item.company}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-950">{item.role}</h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {item.location} • {item.period}
                    </p>
                  </div>
                  <Badge>{item.summary}</Badge>
                </div>
                <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-600">
                  {item.impact.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-sky-600" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  {item.tools.map((tool) => (
                    <Badge key={tool}>{tool}</Badge>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-6">
            <div className="surface rounded-[2rem] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Snapshot</p>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
                <li>Authorized to work in the U.S. with STEM OPT through May 2026.</li>
                <li>Open to relocation and conversations around analytics engineering, BI, and data product roles.</li>
                <li>Strongest in roles that need both technical execution and stakeholder-facing clarity.</li>
              </ul>
            </div>

            <div className="surface rounded-[2rem] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">What stands out</p>
              <div className="mt-5 space-y-4">
                {[
                  "Owns both backend data shaping and frontend reporting experiences.",
                  "Works comfortably with stakeholders, executives, and operational teams.",
                  "Builds systems that get adopted, not just dashboards that get demoed.",
                ].map((item) => (
                  <div key={item} className="rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-4">
                    <p className="text-sm leading-6 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface rounded-[2rem] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Education</p>
              <div className="mt-5 space-y-4">
                {education.map((item) => (
                  <div key={item.school} className="rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-4">
                    <p className="font-medium text-slate-950">{item.degree}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.school}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-500">
                      {item.location} • {item.period}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface rounded-[2rem] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Working style
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">{profileNarratives.workStyle.body}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-7xl scroll-mt-28 py-10 sm:py-12">
        <SectionHeading
          eyebrow="Featured work"
          title="Recent GitHub projects that show a broader analytics + data product range"
          description="The portfolio now leads with newer public repos that demonstrate geospatial tooling, production backend thinking, product UX, and model-backed analytics."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {featuredProjects.map((project) => (
            <article
              key={project.slug}
              className="surface group relative overflow-hidden rounded-[2rem] p-6 transition duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-x-6 top-0 h-px bg-white/60" />
              <div className="absolute inset-x-6 top-6 h-44 overflow-hidden rounded-[1.75rem] opacity-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.32)] sm:h-48">
                <ProjectAccent slug={project.slug} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.34),transparent_42%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.02)_38%,rgba(148,163,184,0.08)_100%)]" />
              </div>

              <div className="relative">
                <div className="relative min-h-44 rounded-[1.75rem] px-5 py-5 sm:min-h-48 sm:px-6 sm:py-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="pt-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-700">
                        {project.client}
                      </p>
                      <h3 className="mt-5 max-w-md text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.2rem]">
                        {project.title}
                      </h3>
                    </div>
                    <div className="rounded-full border border-white/70 bg-white/52 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700 shadow-[0_10px_30px_rgba(255,255,255,0.12)] backdrop-blur-md">
                      {project.year}
                    </div>
                  </div>
                  <div className="mt-10 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/70 bg-white/48 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-[0_6px_20px_rgba(255,255,255,0.12)] backdrop-blur-sm">
                      {project.industry}
                    </span>
                    <span className="rounded-full border border-white/70 bg-white/48 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-[0_6px_20px_rgba(255,255,255,0.12)] backdrop-blur-sm">
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
                  <p className="text-base leading-7 text-slate-700">{project.summary}</p>
                  <div className="flex flex-wrap gap-2 sm:max-w-[240px] sm:justify-end">
                    <Badge>{project.role}</Badge>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                  <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Why this matters
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{project.whyItMatters}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/90 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Design brief
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{project.problem}</p>
                  </div>
                </div>

              <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                {project.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-sky-600" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((tool) => (
                  <Badge key={tool}>{tool}</Badge>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ variant: "secondary" }), "justify-center")}
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
                {project.demo ? (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(buttonVariants({ variant: "primary" }), "justify-center")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {project.slug === "gitdecode-backend" ? "Chrome extension" : "Live demo"}
                  </a>
                ) : null}
              </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <SectionHeading
            eyebrow="Selected analysis work"
            title="Earlier projects that still show strong analytical depth"
            description="These remain useful evidence of NLP, customer analytics, and translating raw datasets into business signals."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {selectedAnalysisProjects.map((project) => (
              <article key={project.slug} className="surface overflow-hidden rounded-[2rem]">
                <div className="grid gap-6 p-6 sm:grid-cols-[140px_1fr] sm:items-start">
                  <div className="relative h-32 overflow-hidden rounded-[1.5rem]">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="140px"
                      />
                    ) : (
                      <ProjectAccent slug={project.slug} />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold text-slate-950">{project.title}</h3>
                      <Badge>{project.year}</Badge>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{project.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.stack.map((tool) => (
                        <Badge key={tool}>{tool}</Badge>
                      ))}
                    </div>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(buttonVariants({ variant: "ghost" }), "mt-5 rounded-full border border-slate-200 bg-white/70")}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      View repository
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="mx-auto max-w-7xl scroll-mt-28 py-10 sm:py-12">
        <SectionHeading
          eyebrow="Skills & toolbox"
          title="Built around BI rigor, application-layer execution, and shipping useful systems"
          description="The strongest thread across my work is turning data into something decision-makers can actually use."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <div key={group.label} className="surface rounded-[2rem] p-6 transition duration-200 hover:-translate-y-1">
              <p className="text-lg font-semibold text-slate-950">{group.label}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl scroll-mt-28 py-10 sm:py-12">
        <div className="surface relative overflow-hidden rounded-[2.25rem] p-8 sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-hero-mesh opacity-70" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
                Get in touch
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Open to teams that care about durable analytics systems and thoughtful data products.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                If you&apos;re hiring for analytics engineering, BI, or product-minded data work, I&apos;d love to connect.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <a href={contactLinks.email} className="rounded-[1.5rem] border border-white/70 bg-white/85 p-5">
                <Mail className="h-5 w-5 text-sky-700" />
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Email
                </p>
                <p className="mt-2 text-sm text-slate-700">akshayjain128@gmail.com</p>
              </a>
              <a href={contactLinks.calendly} target="_blank" rel="noreferrer" className="rounded-[1.5rem] border border-white/70 bg-white/85 p-5">
                <Calendar className="h-5 w-5 text-sky-700" />
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Calendly
                </p>
                <p className="mt-2 text-sm text-slate-700">Book a 30-minute intro</p>
              </a>
              <a href={contactLinks.linkedin} target="_blank" rel="noreferrer" className="rounded-[1.5rem] border border-white/70 bg-white/85 p-5">
                <MapPin className="h-5 w-5 text-sky-700" />
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  LinkedIn
                </p>
                <p className="mt-2 text-sm text-slate-700">linkedin.com/in/akshayjain128</p>
              </a>
              <a href={contactLinks.resume} className="rounded-[1.5rem] border border-white/70 bg-white/85 p-5">
                <Download className="h-5 w-5 text-sky-700" />
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Resume
                </p>
                <p className="mt-2 text-sm text-slate-700">Download PDF</p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
