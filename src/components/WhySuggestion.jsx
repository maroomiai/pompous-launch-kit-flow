import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function WhySuggestion({ explanation, lang = "en" }) {
  const [open, setOpen] = useState(false);
  const label = lang === "es" ? "¿Por qué esta sugerencia?" : "Why this suggestion?";

  if (!explanation) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        <Lightbulb className="w-4 h-4" />
        {label}
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm text-muted-foreground leading-relaxed animate-fade-in">
          {explanation}
        </div>
      )}
    </div>
  );
}