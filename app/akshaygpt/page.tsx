import dynamic from "next/dynamic";
import { AkshayGptLoading } from "@/components/chat/akshay-gpt-loading";
import { Footer } from "@/components/site/footer";
import { PageShell } from "@/components/site/page-shell";

const AkshayGptShell = dynamic(
  () => import("@/components/chat/akshay-gpt-shell").then((module) => module.AkshayGptShell),
  {
    loading: () => <AkshayGptLoading />,
  },
);

export default function AkshayGptPage() {
  return (
    <PageShell>
      <AkshayGptShell />
      <Footer />
    </PageShell>
  );
}
