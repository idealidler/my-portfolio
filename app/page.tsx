import { Footer } from "@/components/site/footer";
import { HomePage } from "@/components/site/home-page";
import { PageShell } from "@/components/site/page-shell";

export default function Page() {
  return (
    <PageShell>
      <HomePage />
      <Footer />
    </PageShell>
  );
}
