import { useState } from "react";
import { TrendingUp, Sparkles, RefreshCw, AlertTriangle, CheckCircle, Target, Zap, BarChart2, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import LoadingSpinner from "../components/LoadingSpinner";
import TipBox from "../components/TipBox";
import FeedbackWidget from "../components/FeedbackWidget";
import { useUser } from "../lib/hooks/useUser";
import { useProducts } from "../lib/hooks/useProducts";

function InsightCard({ icon: Icon, title, items, color, emptyText }) {
  return (
    <div className={`p-5 rounded-xl border ${color}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4" />
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      {items && items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 shrink-0 opacity-60" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm opacity-70">{emptyText}</p>
      )}
    </div>
  );
}

export default function MarketInsights() {
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
      prompt: `You are a market intelligence analyst. Respond in ${langName}.

Product: ${selectedProduct.name}
Category: ${selectedProduct.category}
Features: ${selectedProduct.features || "Not specified"}
Target Audience: ${selectedProduct.target_audience || "General"}
Selling Price: ${selectedProduct.selling_price || "Not set"}

Conduct a comprehensive market analysis. Use your knowledge of current market conditions, consumer trends, and industry benchmarks for this product category.

Provide the following structured analysis:

1. market_summary: 2-3 sentence overview of the market for this product category
2. opportunities: array of 3-4 specific market opportunities (strings)
3. threats: array of 3-4 key risks or competitive pressures (strings)
4. customer_insights: array of 3-4 observations about the target customer (strings)
5. pricing_context: 2-3 sentences on how this product's price compares to the market
6. competitive_landscape: 2-3 sentences on typical competitors and how to differentiate
7. growth_signals: array of 2-3 market trends that could help this business (strings)
8. market_readiness_score: a score from 1-10 for how ready the market is for this product (number only)
9. competitive_intensity: a score from 1-10 for how competitive the market is (number only)
10. demand_level: a score from 1-10 for consumer demand in this category (number only)
11. entry_difficulty: a score from 1-10 for how hard it is to enter this market (number only)
12. growth_potential: a score from 1-10 for the growth potential of this category (number only)
13. strategic_recommendation: 3-4 sentences of the most important strategic advice for this business
14. quick_wins: array of 3 things the business owner can do this week to improve their market position (strings)

Respond in ${langName}. Be specific, practical, and beginner-friendly.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          market_summary: { type: "string" },
          opportunities: { type: "array", items: { type: "string" } },
          threats: { type: "array", items: { type: "string" } },
          customer_insights: { type: "array", items: { type: "string" } },
          pricing_context: { type: "string" },
          competitive_landscape: { type: "string" },
          growth_signals: { type: "array", items: { type: "string" } },
          market_readiness_score: { type: "number" },
          competitive_intensity: { type: "number" },
          demand_level: { type: "number" },
          entry_difficulty: { type: "number" },
          growth_potential: { type: "number" },
          strategic_recommendation: { type: "string" },
          quick_wins: { type: "array", items: { type: "string" } },
        },
      },
    });
    setResult(res);
    } catch (err) {
      console.error("Market Insights generation failed:", err);
      setGenError(err.message || (lang === "es" ? "Error al generar. Intenta de nuevo." : "Generation failed. Please try again."));
    } finally {
      setGenerating(false);
    }
  };

  const radarData = result ? [
    { subject: t("Market Readiness", "Preparación"), value: result.market_readiness_score },
    { subject: t("Demand", "Demanda"), value: result.demand_level },
    { subject: t("Growth", "Crecimiento"), value: result.growth_potential },
    { subject: t("Competition", "Competencia"), value: 10 - result.competitive_intensity },
    { subject: t("Entry", "Entrada"), value: 10 - result.entry_difficulty },
  ] : [];

  const barData = result ? [
    { name: t("Readiness", "Preparación"), value: result.market_readiness_score, fill: "#6366f1" },
    { name: t("Demand", "Demanda"), value: result.demand_level, fill: "#10b981" },
    { name: t("Growth", "Crecimiento"), value: result.growth_potential, fill: "#f59e0b" },
    { name: t("Competition", "Competencia"), value: result.competitive_intensity, fill: "#ef4444" },
  ] : [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          {t("Market Intelligence", "Inteligencia de Mercado")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("Real market insights, competitive signals, and strategic recommendations — powered by live data.", "Perspectivas de mercado reales, señales competitivas y recomendaciones estratégicas.")}
        </p>
      </div>

      <div className="p-5 rounded-xl bg-card border border-border space-y-4">
        <TipBox>
          {t("Select a product and we'll analyse the market conditions, opportunities, and risks — using real-time data.", "Selecciona un producto y analizaremos las condiciones del mercado usando datos en tiempo real.")}
        </TipBox>

        <div className="space-y-2">
          <Label>{t("Select your product", "Selecciona tu producto")}</Label>
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
          {result ? t("Refresh Analysis", "Actualizar Análisis") : t("Generate Market Analysis", "Generar Análisis de Mercado")}
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

      {generating && <LoadingSpinner text={t("Analysing market data and trends...", "Analizando datos y tendencias del mercado...")} />}

      {result && !generating && (
        <div className="space-y-5 animate-fade-in">
          {/* Market Summary */}
          <div className="p-5 rounded-xl bg-primary/5 border border-primary/20">
            <h2 className="font-semibold text-primary mb-2">{t("Market Overview", "Resumen del Mercado")}</h2>
            <p className="text-sm leading-relaxed">{result.market_summary}</p>
          </div>

          {/* Radar Chart */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" />
              {t("Market Position Snapshot", "Instantánea de Posición en el Mercado")}
            </h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barSize={32}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    cursor={{ fill: "hsl(var(--muted))" }}
                  />
                  <Bar dataKey="value" radius={4}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {t("Scores out of 10. Competition shown as raw intensity (higher = more competitive).", "Puntuaciones sobre 10. Competencia: mayor = más competitivo.")}
            </p>
          </div>

          {/* Insight cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <InsightCard
              icon={CheckCircle}
              title={t("Opportunities", "Oportunidades")}
              items={result.opportunities}
              color="bg-emerald-50 border-emerald-200 text-emerald-800"
              emptyText={t("No opportunities found.", "Sin oportunidades.")}
            />
            <InsightCard
              icon={AlertTriangle}
              title={t("Risks & Threats", "Riesgos y Amenazas")}
              items={result.threats}
              color="bg-red-50 border-red-200 text-red-800"
              emptyText={t("No threats found.", "Sin amenazas.")}
            />
          </div>

          <InsightCard
            icon={Target}
            title={t("Customer Insights", "Perspectivas del Cliente")}
            items={result.customer_insights}
            color="bg-blue-50 border-blue-200 text-blue-800"
            emptyText={t("No insights.", "Sin perspectivas.")}
          />

          <InsightCard
            icon={TrendingUp}
            title={t("Growth Signals", "Señales de Crecimiento")}
            items={result.growth_signals}
            color="bg-violet-50 border-violet-200 text-violet-800"
            emptyText={t("No signals found.", "Sin señales.")}
          />

          {/* Pricing & Competition */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-card border border-border">
              <h3 className="font-semibold text-sm mb-2">{t("Pricing Context", "Contexto de Precios")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.pricing_context}</p>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border">
              <h3 className="font-semibold text-sm mb-2">{t("Competitive Landscape", "Panorama Competitivo")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.competitive_landscape}</p>
            </div>
          </div>

          {/* Strategic Recommendation */}
          <div className="p-5 rounded-xl bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-accent" />
              <h2 className="font-semibold text-sm">{t("Strategic Recommendation", "Recomendación Estratégica")}</h2>
            </div>
            <p className="text-sm leading-relaxed">{result.strategic_recommendation}</p>
          </div>

          {/* Quick Wins */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <h3 className="font-semibold text-sm mb-3">{t("Quick Wins This Week", "Victorias Rápidas Esta Semana")}</h3>
            <div className="space-y-3">
              {result.quick_wins?.map((win, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed">{win}</p>
                </div>
              ))}
            </div>
          </div>

          <FeedbackWidget feature="general" productId={selectedProductId} lang={lang} />
        </div>
      )}
    </div>
  );
}