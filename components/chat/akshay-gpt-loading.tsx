import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AkshayGptLoading() {
  return (
    <div className="px-4 pb-14 pt-8 sm:px-6 sm:pt-10 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="surface rounded-[2rem] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back home
            </Link>
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              AkshayGPT
            </p>
            <div className="mx-auto mt-4 h-12 w-64 rounded-full bg-white/75" />
          </div>

          <div className="mx-auto mt-8 max-w-2xl rounded-full border border-slate-200/80 bg-white/88 px-3 py-3 shadow-sm">
            <div className="h-12 rounded-full bg-slate-100/80" />
          </div>

          <div className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-9 w-40 rounded-full border border-slate-200/80 bg-white/82" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
