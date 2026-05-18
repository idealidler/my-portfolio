import { Footer } from "@/components/site/footer";
import { HomePage } from "@/components/site/home-page";
import { PageShell } from "@/components/site/page-shell";
import { ScrollToTopProgress } from "@/components/site/scroll-to-top-progress";

export default function Page() {
  return (
    <PageShell>
      <HomePage />
      <Footer />
      <ScrollToTopProgress />
    </PageShell>
  );
}
