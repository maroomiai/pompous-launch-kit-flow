import { useState } from "react";
import { Palette, Sparkles, RefreshCw, Copy, Check, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import WhySuggestion from "../components/WhySuggestion";
import FeedbackWidget from "../components/FeedbackWidget";
import LoadingSpinner from "../components/LoadingSpinner";
import TipBox from "../components/TipBox";
import EmptyState from "../components/EmptyState";
import { useUser } from "../lib/hooks/useUser";
import { useProducts } from "../lib/hooks/useProducts";

export default function Branding() {
  const { user } = useUser();
  const { data: products = [] } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState(null);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState("");

  const lang = user?.language || "en";
  const selectedProduct = products.find(p => p.id === selectedProductId);

  const generate = async () => {
    if (!selectedProduct) return;
    setGenerating(true);
    setGenError(null);
    const langName = lang === "es" ? "Spanish" : "English";
    try {
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a brand strategist helping a beginner entrepreneur. Respond in ${langName}.

Product: ${selectedProduct.name}
Category: ${selectedProduct.category}
Features: ${selectedProduct.features || "Not specified"}
Target Audience: ${selectedProduct.target_audience || "General audience"}
Current Price: ${selectedProduct.selling_price || "Not set"}

Create a complete branding strategy for this product. Include:

1. Brand Direction: 2-3 sentence brand vision and personality summary
2. Tone of Voice: 4 descriptive words for how the brand should sound, with one sentence explaining each
3. Brand Values: 3 core values with brief explanations
4. Tagline Options: 3 tagline options (catchy, under 8 words each)
5. Value Proposition: 1-2 sentence statement explaining who this is for and what makes it different
6. Customer Promise: A short, emotional sentence the brand makes to customers
7. Market Positioning: Where this product sits in the market (budget/mid-range/premium) and why
8. Competitor Differentiation: How to stand out from typical competitors in this category

Also provide a brief explanation of why this branding direction makes sense for this product and audience (2-3 sentences, beginner-friendly).

Return in ${langName}.`,
      response_json_schema: {
        type: "object",
        properties: {
          brand_direction: { type: "string" },
          tone_of_voice: { type: "string" },
          brand_values: { type: "string" },
          taglines: { type: "string" },
          value_proposition: { type: "string" },
          customer_promise: { type: "string" },
          market_positioning: { type: "string" },
          differentiation: { type: "string" },
          explanation: { type: "string" },
        },
      },
    });
    setResult(res);
    } catch (err) {
      console.error("Branding generation failed:", err);
      setGenError(err.message || (lang === "es" ? "Error al generar. Intenta de nuevo." : "Generation failed. Please try again."));
    } finally {
      setGenerating(false);
    }
  };

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const t = (en, es) => lang === "es" ? es : en;

  const sections = result ? [
    { key: "brand_direction", label: t("Brand Direction", "Dirección de Marca"), value: result.brand_direction, highlight: true },
    { key: "value_proposition", label: t("Value Proposition", "Propuesta de Valor"), value: result.value_proposition, highlight: true },
    { key: "customer_promise", label: t("Customer Promise", "Promesa al Cliente"), value: result.customer_promise, highlight: true },
    { key: "taglines", label: t("Tagline Options", "Opciones de Eslogan"), value: result.taglines },
    { key: "tone_of_voice", label: t("Tone of Voice", "Tono de Voz"), value: result.tone_of_voice },
    { key: "brand_values", label: t("Brand Values", "Valores de Marca"), value: result.brand_values },
    { key: "market_positioning", label: t("Market Positioning", "Posicionamiento"), value: result.market_positioning },
    { key: "differentiation", label: t("How to Stand Out", "Cómo Diferenciarse"), value: result.differentiation },
  ] : [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Palette className="w-6 h-6 text-primary" />
          {t("Branding & Positioning", "Marca y Posicionamiento")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("Get your brand direction, tone, taglines, and market positioning — all in plain language.", "Obtén tu dirección de marca, tono, eslogan y posicionamiento de mercado.")}
        </p>
      </div>

      <div className="p-5 rounded-xl bg-card border border-border space-y-4">
        <TipBox>
          {t("Select a product and our AI will build a complete branding strategy — no marketing experience needed.", "Selecciona un producto y la IA creará una estrategia de marca completa.")}
        </TipBox>

        <div className="space-y-2">
          <Label>{t("Select a Product", "Selecciona un Producto")}</Label>
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("No products yet. Add one first.", "Sin productos. Agrega uno primero.")}</p>
          ) : (
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
          )}
        </div>

        <Button onClick={generate} disabled={!selectedProductId || generating} className="w-full gap-2">
          {result ? <RefreshCw className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          {result ? t("Regenerate", "Regenerar") : t("Generate Branding Strategy", "Generar Estrategia de Marca")}
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

      {generating && <LoadingSpinner text={t("Building your brand identity...", "Construyendo tu identidad de marca...")} />}

      {result && !generating && (
        <div className="space-y-4 animate-fade-in">
          {sections.map(s => (
            <div key={s.key} className={`p-5 rounded-xl border ${s.highlight ? "bg-primary/5 border-primary/20" : "bg-card border-border"}`}>
              <div className="flex items-center justify-between mb-2">
                <Label className={s.highlight ? "text-primary font-semibold" : ""}>{s.label}</Label>
                <button onClick={() => copy(s.value, s.key)} className="text-muted-foreground hover:text-foreground transition-colors">
                  {copied === s.key ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{s.value}</p>
            </div>
          ))}

          <WhySuggestion explanation={result.explanation} lang={lang} />
          <FeedbackWidget feature="general" productId={selectedProductId} lang={lang} />
        </div>
      )}

      {!result && !generating && products.length > 0 && !selectedProductId && (
        <EmptyState
          icon={Palette}
          title={t("Select a product to begin", "Selecciona un producto para empezar")}
          description={t("Choose a product above and generate your complete brand identity.", "Elige un producto arriba para generar tu identidad de marca completa.")}
        />
      )}
    </div>
  );
}