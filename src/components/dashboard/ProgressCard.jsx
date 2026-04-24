import { Check, Circle } from "lucide-react";

export default function ProgressCard({ steps, lang = "en" }) {
  const completedCount = steps.filter((s) => s.done).length;
  const percentage = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="p-5 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">
          {lang === "es" ? "Progreso de Lanzamiento" : "Launch Progress"}
        </h3>
        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
          {percentage}%
        </span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="space-y-2.5">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            {step.done ? (
              <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                <Check className="w-3 h-3 text-success-foreground" />
              </div>
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground/40" />
            )}
            <span className={`text-sm ${step.done ? "text-foreground line-through opacity-60" : "text-foreground"}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}