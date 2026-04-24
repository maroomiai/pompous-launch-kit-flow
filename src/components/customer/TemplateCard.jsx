import { useState } from "react";
import { Copy, Trash2, Star, ChevronDown, ChevronUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../../lib/i18n";

export default function TemplateCard({ template, lang, onDelete, onToggleFavorite }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation(lang);

  const copyReply = () => {
    navigator.clipboard.writeText(template.suggested_reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 rounded-xl bg-card border border-border hover:shadow-sm transition-all">
      <div className="flex items-start gap-3">
        <button onClick={onToggleFavorite} className="mt-0.5 shrink-0">
          <Star className={`w-4 h-4 ${template.is_favorite ? "text-warning fill-warning" : "text-muted-foreground/40"}`} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {t(`scenario_${template.scenario}`)}
            </span>
          </div>
          <p className="text-sm font-medium truncate">{template.title}</p>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-2 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {expanded ? (lang === "es" ? "Ocultar" : "Hide") : (lang === "es" ? "Ver respuesta" : "View reply")}
          </button>

          {expanded && (
            <div className="mt-3 space-y-3 animate-fade-in">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {lang === "es" ? "Mensaje del cliente:" : "Customer message:"}
                </p>
                <p className="text-sm bg-muted/50 p-3 rounded-lg">{template.customer_message}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {lang === "es" ? "Respuesta sugerida:" : "Suggested reply:"}
                </p>
                <p className="text-sm bg-primary/5 p-3 rounded-lg whitespace-pre-line">{template.suggested_reply}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyReply}>
            {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}