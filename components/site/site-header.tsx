"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const homeLinks = [
  { href: "#proof", label: "Proof" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const links =
    pathname === "/"
      ? [...homeLinks, { href: "/akshaygpt", label: "AkshayGPT" }]
      : [
          { href: "/", label: "Home" },
          { href: "/#projects", label: "Projects" },
          { href: "/#contact", label: "Contact" },
        ];

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="surface-strong mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white shadow-card">
            AJ
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Akshay Jain
            </p>
            <p className="text-sm text-slate-700">Analytics Engineer</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/akshaygpt" className={cn(buttonVariants({ variant: "secondary" }))}>
            <Sparkles className="mr-2 h-4 w-4" />
            Open AkshayGPT
          </Link>
          <Link href="/#contact" className={cn(buttonVariants({ variant: "primary" }))}>
            Let&apos;s connect
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 lg:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="surface-strong mx-auto mt-3 max-w-7xl rounded-[2rem] px-5 py-5 lg:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setIsOpen(false)}
              className={cn(buttonVariants({ variant: "primary" }), "mt-2")}
            >
              Let&apos;s connect
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
