import clsx from "clsx";
import type { FunnelStage } from "@/types";
import { FUNNEL_STAGE_LABELS } from "@/types";

const STYLES: Record<FunnelStage, string> = {
  TOFU: "bg-cyan-400/15 text-cyan-300 border border-cyan-400/30",
  MOFU: "bg-violet-400/15 text-violet-300 border border-violet-400/30",
  BOFU: "bg-pink-400/15 text-pink-300 border border-pink-400/30",
};

export default function FunnelBadge({ stage }: { stage: FunnelStage }) {
  return (
    <span className={clsx("px-2.5 py-1 rounded-full text-[11px] font-semibold", STYLES[stage])}>
      {FUNNEL_STAGE_LABELS[stage]}
    </span>
  );
}
