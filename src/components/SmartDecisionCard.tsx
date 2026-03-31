import type { SmartDecision } from "@/lib/currencies";

interface SmartDecisionCardProps {
  decision: SmartDecision;
}

export default function SmartDecisionCard({ decision }: SmartDecisionCardProps) {
  const dotColor = {
    success: "bg-success shadow-[0_0_8px_hsl(var(--success)/0.6)]",
    warning: "bg-warning shadow-[0_0_8px_hsl(var(--warning)/0.6)]",
    neutral: "bg-muted-foreground shadow-none",
  }[decision.variant];

  const textColor = {
    success: "text-success",
    warning: "text-warning",
    neutral: "text-muted-foreground",
  }[decision.variant];

  return (
    <div className="bg-foreground/[0.02] rounded-xl p-4 flex items-start gap-4">
      <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
      <div className="space-y-1">
        <p className={`text-sm font-medium ${textColor}`}>{decision.label}</p>
        <p className="text-xs text-foreground/40 leading-relaxed">{decision.sub}</p>
      </div>
    </div>
  );
}
