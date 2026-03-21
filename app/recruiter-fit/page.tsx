import { JobFitAnalyzer } from "@/components/chat/job-fit-analyzer";
import { Footer } from "@/components/site/footer";
import { PageShell } from "@/components/site/page-shell";

export default function RecruiterFitPage() {
  return (
    <PageShell>
      <JobFitAnalyzer />
      <Footer />
    </PageShell>
  );
}
