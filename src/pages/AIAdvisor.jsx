import { useState } from "react";
import { Brain, Sparkles, RefreshCw, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "../components/LoadingSpinner";
import TipBox from "../components/TipBox";
import FeedbackWidget from "../components/FeedbackWidget";
import { useUser } from "../lib/hooks/useUser";
import { useProducts } from "../lib/hooks/useProducts";

const DIFFICULTY_COLORS = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
};

const IMPACT_COLORS = {
  high: "bg-primary/10 text-primary",
  medium: "bg-accent/10 text-accent",
  low: "bg-muted text-muted-foreground",
};

function AIUseCase({ item, lang }) {
  const [open, setOpen] = useState(false);
  const t = (en, es) => lang === "es" ? es : en;

  return (
    <div className="p-5 rounded-xl bg-card border border-border hover:shadow-sm transition-all">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${IMPACT_COLORS[item.impact?.toLowerCase()] || IMPACT_COLORS.medium}`}>
              {t("Impact:", "Impacto:")} {item.impact}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[item.difficulty?.toLowerCase()] || DIFFICULTY_COLORS.medium}`}>
              {t("Effort:", "Esfuerzo:")} {item.difficulty}
            </span>
          </div>
          <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 mt-3 font-medium"
          >
            {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {t("Why this suggestion?", "¿Por qué esta sugerencia?")}
          </button>

          {open && (
            <div className="mt-3 p-3 rounded-lg bg-accent/10 border border-accent/20 animate-fade-in">
              <p className="text-xs text-foreground leading-relaxed">{item.rationale}</p>
              {item.next_step && (
                <div className="mt-2 pt-2 border-t border-accent/20">
                  <p className="text-xs font-semibold text-accent">{t("Next step:", "Siguiente paso:")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.next_step}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AIAdvisor() {
  const { user } = useUser();
  const { data: products = [] } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState(null);
  const [result, setResult] = useState(null);

  const lang = user?.language || "en";
  const selectedProduct = products.find(p => p.id === selectedProductId);
  const t = (en, es) => lang === "es" ? es : en;

  const generate = async () => {
    if (!selectedProduct) return;
    setGenerating(true);
    setGenError(null);
    const langName = lang === "es" ? "Spanish" : "English";
    try {
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an AI business advisor helping a beginner entrepreneur understand how to use AI in their business. Respond in ${langName}.

Business/Product: ${selectedProduct.name}
Category: ${selectedProduct.category}
Description: ${selectedProduct.features || "Not specified"}
Target Audience: ${selectedProduct.target_audience || "General"}

Generate a personalised AI integration plan for this business. Include 6-8 practical AI use cases, ordered from easiest/most impactful to hardest/least impactful.

For each use case provide:
- title: short name (3-5 words)
- description: what it does and how it helps (2-3 sentences, plain language, non-technical)
- impact: "High", "Medium", or "Low"
- difficulty: "Easy", "Medium", or "Hard"
- rationale: why this makes sense for THIS specific business (2-3 sentences)
- next_step: one concrete first action the business owner can take today (1 sentence)
- category: one of "customer_service", "marketing", "operations", "product", "research"

Also provide:
- summary: a 2-3 sentence plain-language overview of the AI opportunity for this business
- priority_recommendation: the single most important AI use case to start with, and why (2-3 sentences)`,
      response_json_schema: {
        type: "object",
        properties: {
          summary: { type: "string" },
          priority_recommendation: { type: "string" },
          use_cases: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                impact: { type: "string" },
                difficulty: { type: "string" },
                rationale: { type: "string" },
                next_step: { type: "string" },
                category: { type: "string" },
              },
            },
          },
        },
      },
    });
    setResult(res);
    } catch (err) {
      console.error("AI Advisor generation failed:", err);
      setGenError(err.message || (lang === "es" ? "Error al generar. Intenta de nuevo." : "Generation failed. Please try again."));
    } finally {
      setGenerating(false);
    }
  };

  const categories = result?.use_cases
    ? [...new Set(result.use_cases.map(u => u.category))]
    : [];

  const categoryLabels = {
    customer_service: t("Customer Service", "Servicio al Cliente"),
    marketing: t("Marketing", "Marketing"),
    operations: t("Operations", "Operaciones"),
    product: t("Product", "Producto"),
    research: t("Research", "Investigación"),
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          {t("AI Integration Advisor", "Asesor de Integración IA")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("Discover practical ways to use AI in your business — no technical knowledge needed.", "Descubre formas prácticas de usar IA en tu negocio, sin conocimientos técnicos.")}
        </p>
      </div>

      <div className="p-5 rounded-xl bg-card border border-border space-y-4">
        <TipBox>
          {t("We'll analyse your business and give you a personalised AI adoption plan — ordered by impact and ease of use.", "Analizaremos tu negocio y te daremos un plan de adopción de IA personalizado.")}
        </TipBox>

        <div className="space-y-2">
          <Label>{t("Select your product or business", "Selecciona tu producto o negocio")}</Label>
          <Select value={selectedProductId} onValueChange={setSelectedProductId}>
            <SelectTrigger>
              <SelectValue placeholder={t("Choose a product...", "Elige un producto...")} />
            </SelectTrigger>
            <SelectContent>
              {products.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={generate} disabled={!selectedProductId || generating} className="w-full gap-2">
          {result ? <RefreshCw className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          {result ? t("Regenerate Plan", "Regenerar Plan") : t("Generate My AI Plan", "Generar Mi Plan de IA")}
        </Button>
      </div>

      {genError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>{genError}</span>
            <button onClick={generate} className="ml-3 underline font-medium hover:no-underline">
              {t("Retry", "Reintentar")}
            </button>
          </div>
        </div>
      )}

      {generating && <LoadingSpinner text={t("Analysing your business for AI opportunities...", "Analizando tu negocio para oportunidades de IA...")} />}

      {result && !generating && (
        <div className="space-y-5 animate-fade-in">
          {/* Summary */}
          <div className="p-5 rounded-xl bg-primary/5 border border-primary/20">
            <h2 className="font-semibold text-primary mb-2">{t("AI Opportunity Summary", "Resumen de Oportunidades IA")}</h2>
            <p className="text-sm leading-relaxed">{result.summary}</p>
          </div>

          {/* Priority recommendation */}
          <div className="p-5 rounded-xl bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <h2 className="font-semibold text-sm">{t("Start Here", "Empieza Aquí")}</h2>
            </div>
            <p className="text-sm leading-relaxed">{result.priority_recommendation}</p>
          </div>

          {/* Use cases grouped by category */}
          {categories.map(cat => (
            <div key={cat}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">
                {categoryLabels[cat] || cat}
              </h3>
              <div className="space-y-3">
                {result.use_cases.filter(u => u.category === cat).map((item, i) => (
                  <AIUseCase key={i} item={item} lang={lang} />
                ))}
              </div>
            </div>
          ))}

          <FeedbackWidget feature="general" productId={selectedProductId} lang={lang} />
        </div>
      )}
    </div>
  );
}