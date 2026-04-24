import { useState } from "react";
import { Sparkles, Copy, Check, RefreshCw, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { validateLLMOutput } from "../../lib/llmValidation";
import WhySuggestion from "../WhySuggestion";
import FeedbackWidget from "../FeedbackWidget";
import LoadingSpinner from "../LoadingSpinner";
import TipBox from "../TipBox";

export default function ListingGenerator({ product, lang, onUpdate, onNext }) {
  const [generating, setGenerating] = useState(false);
  const [listing, setListing] = useState({
    listing_title: product.listing_title || "",
    short_description: product.short_description || "",
    long_description: product.long_description || "",
    bullet_points: product.bullet_points || "",
  });
  const [explanation, setExplanation] = useState(product.listing_explanation || "");
  const [copied, setCopied] = useState("");
  const [saving, setSaving] = useState(false);
  const [genError, setGenError] = useState(null);

  const generate = async () => {
    setGenerating(true);
    setGenError(null);
    const langName = lang === "es" ? "Spanish" : "English";
    try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an e-commerce product listing expert. Generate a professional product listing in ${langName}.

Product: ${product.name}
Category: ${product.category}
Features: ${product.features || "Not specified"}
Keywords: ${product.keywords || "Not specified"}
Target Audience: ${product.target_audience || "General audience"}

Generate:
1. SEO-friendly product title (catchy, clear, under 80 characters)
2. Short description (1-2 sentences, compelling)
3. Long description (3-4 paragraphs, detailed, persuasive, includes keywords naturally)
4. Bullet points (5-7 key selling points, each starting with a benefit)

Also provide a brief explanation of WHY you chose this approach (2-3 sentences, written for a beginner who doesn't know marketing).

Return in ${langName}.`,
      response_json_schema: {
        type: "object",
        properties: {
          listing_title: { type: "string" },
          short_description: { type: "string" },
          long_description: { type: "string" },
          bullet_points: { type: "string" },
          explanation: { type: "string" },
        },
      },
    });

    const validated = validateLLMOutput(
      result,
      ["listing_title", "short_description", "long_description", "bullet_points"],
      "Listing Generator"
    );
    setListing({
      listing_title: validated.listing_title,
      short_description: validated.short_description,
      long_description: validated.long_description,
      bullet_points: validated.bullet_points,
    });
    setExplanation(validated.explanation || "");
    } catch (err) {
      console.error("Listing generation failed:", err);
      setGenError(err.message || (lang === "es" ? "Error al generar. Intenta de nuevo." : "Generation failed. Please try again."));
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.Product.update(product.id, {
        ...listing,
        listing_explanation: explanation,
        status: product.status === "draft" ? "listing_done" : product.status,
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

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(""), 2000);
  };

  const hasListing = listing.listing_title && listing.short_description;

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">
            {lang === "es" ? "Generador de Listado" : "Listing Generator"}
          </h3>
          <Button onClick={generate} disabled={generating} variant={hasListing ? "outline" : "default"} className="gap-2">
            {hasListing ? <RefreshCw className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {hasListing
              ? (lang === "es" ? "Regenerar" : "Regenerate")
              : (lang === "es" ? "Generar con IA" : "Generate with AI")}
          </Button>
        </div>

        <TipBox lang={lang}>
          {lang === "es"
            ? "La IA creará un listado profesional basado en tu producto. Puedes editarlo después."
            : "AI will create a professional listing based on your product info. You can edit everything after."}
        </TipBox>
      </div>

      {genError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>{genError}</span>
            <button onClick={generate} className="ml-3 underline font-medium hover:no-underline">
              {lang === "es" ? "Reintentar" : "Retry"}
            </button>
          </div>
        </div>
      )}

      {generating ? (
        <LoadingSpinner text={lang === "es" ? "Creando tu listado..." : "Creating your listing..."} />
      ) : hasListing ? (
        <div className="space-y-5 animate-fade-in">
          {/* Title */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-2">
              <Label>{lang === "es" ? "Título del Producto" : "Product Title"}</Label>
              <button onClick={() => copyToClipboard(listing.listing_title, "title")} className="text-muted-foreground hover:text-foreground">
                {copied === "title" ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <Input
              value={listing.listing_title}
              onChange={(e) => setListing({ ...listing, listing_title: e.target.value })}
            />
          </div>

          {/* Short Description */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-2">
              <Label>{lang === "es" ? "Descripción Corta" : "Short Description"}</Label>
              <button onClick={() => copyToClipboard(listing.short_description, "short")} className="text-muted-foreground hover:text-foreground">
                {copied === "short" ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <Textarea
              value={listing.short_description}
              onChange={(e) => setListing({ ...listing, short_description: e.target.value })}
              rows={2}
            />
          </div>

          {/* Long Description */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-2">
              <Label>{lang === "es" ? "Descripción Larga" : "Long Description"}</Label>
              <button onClick={() => copyToClipboard(listing.long_description, "long")} className="text-muted-foreground hover:text-foreground">
                {copied === "long" ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <Textarea
              value={listing.long_description}
              onChange={(e) => setListing({ ...listing, long_description: e.target.value })}
              rows={6}
            />
          </div>

          {/* Bullet Points */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-2">
              <Label>{lang === "es" ? "Puntos de Venta" : "Key Selling Points"}</Label>
              <button onClick={() => copyToClipboard(listing.bullet_points, "bullets")} className="text-muted-foreground hover:text-foreground">
                {copied === "bullets" ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <Textarea
              value={listing.bullet_points}
              onChange={(e) => setListing({ ...listing, bullet_points: e.target.value })}
              rows={5}
            />
          </div>

          <WhySuggestion explanation={explanation} lang={lang} />
          <FeedbackWidget feature="listing_generator" productId={product.id} lang={lang} />

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="flex-1 gap-2">
              {saving && <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
              {lang === "es" ? "Guardar y Continuar" : "Save & Continue"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}