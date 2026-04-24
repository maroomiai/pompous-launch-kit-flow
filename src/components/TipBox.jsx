import { Lightbulb } from "lucide-react";

export default function TipBox({ children, lang = "en" }) {
  return (
    <div className="flex gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
      <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
      <p className="text-xs text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}