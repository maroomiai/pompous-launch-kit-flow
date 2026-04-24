import { useState } from "react";
import { DollarSign, TrendingUp, Calculator } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WhySuggestion from "../WhySuggestion";
import FeedbackWidget from "../FeedbackWidget";
import LoadingSpinner from "../LoadingSpinner";
import TipBox from "../TipBox";

const CATEGORY_MARKUPS = {
  clothing: 2.2, electronics: 1.5, food_beverage: 2.0, beauty: 2.5,
  home_garden: 1.8, toys: 2.0, sports: 1.8, books: 1.6,
  jewelry: 3.0, handmade: 2.5, digital: 5.0, other: 2.0,
};

export default function PricingEngine({ product, lang, onUpdate, onNext }) {
  const [costPrice, setCostPrice] = useState(product.cost_price || "");
  const [competitorPrice, setCompetitorPrice] = useState(product.competitor_price || "");
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState(
    product.suggested_price
      ? {
          suggestedPrice: product.suggested_price,
          margin: product.suggested_margin,
          rationale: product.pricing_rationale,
        }
      : null
  );
  const [sellingPrice, setSellingPrice] = useState(product.selling_price || "");
  const [saving, setSaving] = useState(false);

  const calculatePrice = async () => {
    if (!costPrice) return;
    setCalculating(true);

    const cost = parseFloat(costPrice);
    const markup = CATEGORY_MARKUPS[product.category] || 2.0;
    const basePrice = Math.round(cost * markup * 100) / 100;
    
    let suggestedPrice = basePrice;
    let rationale = "";

    const comp = competitorPrice ? parseFloat(competitorPrice) : null;

    if (comp) {
      if (basePrice > comp * 1.3) {
        suggestedPrice = Math.round(comp * 0.95 * 100) / 100;
        rationale = lang === "es"
          ? `Tu costo es $${cost}. El precio típico para ${product.category} usa un multiplicador de ${markup}x, lo que da $${basePrice}. Sin embargo, tu competidor vende a $${comp}, así que sugerimos $${suggestedPrice} para ser competitivo.`
          : `Your cost is $${cost}. Typical ${product.category} markup is ${markup}x, giving $${basePrice}. However, competitor sells at $${comp}, so we suggest $${suggestedPrice} to stay competitive.`;
      } else {
        suggestedPrice = Math.round((basePrice + comp) / 2 * 100) / 100;
        rationale = lang === "es"
          ? `Tu costo es $${cost}. Con un multiplicador de ${markup}x = $${basePrice}. Competidor: $${comp}. Sugerimos $${suggestedPrice} (promedio entre ambos).`
          : `Your cost is $${cost}. At ${markup}x markup = $${basePrice}. Competitor: $${comp}. We suggest $${suggestedPrice} (average of both).`;
      }
    } else {
      rationale = lang === "es"
        ? `Tu costo es $${cost}. Para ${product.category}, el multiplicador típico es ${markup}x. Precio sugerido: $${suggestedPrice}.`
        : `Your cost is $${cost}. For ${product.category}, typical markup is ${markup}x. Suggested price: $${suggestedPrice}.`;
    }

    const margin = Math.round(((suggestedPrice - cost) / suggestedPrice) * 100);

    // Add warnings
    let warnings = [];
    if (margin < 20) {
      warnings.push(lang === "es" ? "⚠️ Margen bajo. Considera aumentar el precio." : "⚠️ Low margin. Consider raising the price.");
    }
    if (suggestedPrice > cost * 5) {
      warnings.push(lang === "es" ? "⚠️ Precio alto para esta categoría. Verifica con tu mercado." : "⚠️ High price for this category. Verify with your market.");
    }

    const fullRationale = warnings.length > 0 ? rationale + "\n\n" + warnings.join("\n") : rationale;

    setResult({ suggestedPrice, margin, rationale: fullRationale });
    setSellingPrice(suggestedPrice);
    setCalculating(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.Product.update(product.id, {
        cost_price: costPrice ? parseFloat(costPrice) : undefined,
        competitor_price: competitorPrice ? parseFloat(competitorPrice) : undefined,
        suggested_price: result?.suggestedPrice,
        suggested_margin: result?.margin,
        pricing_rationale: result?.rationale,
        selling_price: sellingPrice ? parseFloat(sellingPrice) : undefined,
        status: ["draft", "listing_done"].includes(product.status) ? "priced" : product.status,
      });
      await onUpdate();
      onNext();
    } catch (err) {
      console.error("Save failed:", err);
      toast.error(lang === "es" ? "Error al guardar. Intenta de nuevo." : "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="p-5 rounded-xl bg-card border border-border space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          {lang === "es" ? "Motor de Precios" : "Pricing Engine"}
        </h3>

        <TipBox lang={lang}>
          {lang === "es"
            ? "Ingresa tu costo y opcionalmente el precio de un competidor. Usaremos reglas simples de la industria para sugerir un precio."
            : "Enter your cost and optionally a competitor's price. We'll use simple industry rules to suggest a selling price."}
        </TipBox>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{lang === "es" ? "Precio de Costo *" : "Cost Price *"}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="pl-7"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{lang === "es" ? "Precio Competencia (opcional)" : "Competitor Price (optional)"}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={competitorPrice}
                onChange={(e) => setCompetitorPrice(e.target.value)}
                className="pl-7"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <Button onClick={calculatePrice} disabled={!costPrice || calculating} className="w-full gap-2">
          <DollarSign className="w-4 h-4" />
          {lang === "es" ? "Calcular Precio Sugerido" : "Calculate Suggested Price"}
        </Button>
      </div>

      {calculating && (
        <LoadingSpinner text={lang === "es" ? "Calculando..." : "Calculating..."} />
      )}

      {/* Results */}
      {result && !calculating && (
        <div className="space-y-5 animate-fade-in">
          {/* Price Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-primary/5 border border-primary/10 text-center">
              <p className="text-xs text-muted-foreground mb-1">{lang === "es" ? "Precio Sugerido" : "Suggested Price"}</p>
              <p className="text-3xl font-bold text-primary">${result.suggestedPrice}</p>
            </div>
            <div className="p-5 rounded-xl bg-success/5 border border-success/10 text-center">
              <p className="text-xs text-muted-foreground mb-1">{lang === "es" ? "Margen de Ganancia" : "Profit Margin"}</p>
              <p className="text-3xl font-bold text-success">{result.margin}%</p>
            </div>
          </div>

          {/* Calculation Breakdown */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              {lang === "es" ? "Desglose del Cálculo" : "Calculation Breakdown"}
            </h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{result.rationale}</p>
          </div>

          {/* Override Price */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <Label className="mb-2 block">
              {lang === "es" ? "Tu Precio Final (puedes cambiarlo)" : "Your Final Price (you can change it)"}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="number"
                step="0.01"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="pl-7 text-lg font-bold"
              />
            </div>
          </div>

          <WhySuggestion
            explanation={
              lang === "es"
                ? "Usamos multiplicadores estándar de la industria para tu categoría de producto. Si agregaste un precio de competencia, lo usamos para ajustar la sugerencia. Siempre puedes cambiar el precio final."
                : "We used standard industry markup multipliers for your product category. If you added a competitor price, we factored it in. You can always override the final price."
            }
            lang={lang}
          />

          <FeedbackWidget feature="pricing_engine" productId={product.id} lang={lang} />

          <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
            {saving && <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
            {lang === "es" ? "Guardar y Continuar" : "Save & Continue"}
          </Button>
        </div>
      )}
    </div>
  );
}