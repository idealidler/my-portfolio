"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const hash = decodeURIComponent(window.location.hash.slice(1));

    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    let frame = 0;
    const maxFrames = 12;

    const scrollToHash = () => {
      const target = document.getElementById(hash);

      if (target) {
        target.scrollIntoView({ block: "start", behavior: "auto" });
        return;
      }

      if (frame < maxFrames) {
        frame += 1;
        window.requestAnimationFrame(scrollToHash);
      }
    };

    window.requestAnimationFrame(scrollToHash);
  }, [pathname]);

  return null;
}
