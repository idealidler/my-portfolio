import { SiteHeader } from "@/components/site/site-header";

type PageShellProps = {
  children: React.ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="hero-orb hero-orb-one left-[-4rem] top-24 animate-float" />
      <div className="hero-orb hero-orb-two right-[-6rem] top-40 animate-float" />
      <div className="hero-orb hero-orb-three bottom-0 left-1/3 animate-float" />
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40" />
      <SiteHeader />
      <main>{children}</main>
    </div>
  );
}
