import clsx from "clsx";
import type { Platform } from "@/types";

const STYLES: Record<Platform, string> = {
  TIKTOK: "bg-black text-white border border-white/20",
  INSTAGRAM: "bg-gradient-to-tr from-amber-400 via-pink-500 to-violet-600 text-white",
  OTHER: "bg-surface-2 text-muted border border-border",
};

const LABELS: Record<Platform, string> = {
  TIKTOK: "TikTok",
  INSTAGRAM: "Instagram",
  OTHER: "Otro",
};

export default function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span
      className={clsx(
        "px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide",
        STYLES[platform]
      )}
    >
      {LABELS[platform]}
    </span>
  );
}
