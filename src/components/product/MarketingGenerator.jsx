import { useState } from "react";
import { Megaphone, Copy, Check, RefreshCw, Sparkles, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { validateLLMOutput } from "../../lib/llmValidation";
import WhySuggestion from "../WhySuggestion";
import FeedbackWidget from "../FeedbackWidget";
import LoadingSpinner from "../LoadingSpinner";
import TipBox from "../TipBox";

const TONES = {
  en: [
    { value: "friendly", label: "Friendly & Casual" },
    { value: "professional", label: "Professional" },
    { value: "exciting", label: "Exciting & Bold" },
    { value: "simple", label: "Simple & Clear" },
  ],
  es: [
    { value: "friendly", label: "Amigable y Casual" },
    { value: "professional", label: "Profesional" },
    { value: "exciting", label: "Emocionante y Audaz" },
    { value: "simple", label: "Simple y Claro" },
  ],
};

export default function MarketingGenerator({ product, lang, onUpdate, onNext }) {
  const [tone, setTone] = useState("friendly");
  const [generating, setGenerating] = useState(false);
  const [content, setContent] = useState({
    captions: product.marketing_captions || "",
    email: product.marketing_email || "",
    adCopy: product.marketing_ad_copy || "",
  });
  const [explanation, setExplanation] = useState(product.marketing_explanation || "");
  const [copied, setCopied] = useState("");
  const [saving, setSaving] = useState(false);
  const [genError, setGenError] = useState(null);

  const generate = async () => {
    setGenerating(true);
    setGenError(null);
    const langName = lang === "es" ? "Spanish" : "English";
    try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert marketing copywriter helping a beginner entrepreneur. Write in ${langName}.

Product: ${product.name}
Description: ${product.short_description || product.features || "No description"}
Category: ${product.category}
Price: $${product.selling_price || product.suggested_price || "Not set"}
Target Audience: ${product.target_audience || "General"}
Tone: ${tone}

Generate:
1. Three social media captions (Instagram/Facebook style, include emojis, hashtags). Separate each with "---".
2. One email campaign draft (subject line + body, for a product launch or promotion)
3. Two short ad copy variations (for Facebook/Google Ads, punchy and concise)

Also explain WHY you chose this approach (2 sentences, beginner-friendly).`,
      response_json_schema: {
        type: "object",
        properties: {
          captions: { type: "string" },
          email: { type: "string" },
          ad_copy: { type: "string" },
          explanation: { type: "string" },
        },
      },
    });

    const validated = validateLLMOutput(result, ["captions", "email"], "Marketing Generator");
    setContent({
      captions: validated.captions,
      email: validated.email,
      adCopy: validated.ad_copy || "",
    });
    setExplanation(validated.explanation || "");
    } catch (err) {
      console.error("Marketing generation failed:", err);
      setGenError(err.message || (lang === "es" ? "Error al generar. Intenta de nuevo." : "Generation failed. Please try again."));
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.Product.update(product.id, {
        marketing_captions: content.captions,
        marketing_email: content.email,
        marketing_ad_copy: content.adCopy,
        marketing_explanation: explanation,
        status: ["draft", "listing_done", "priced"].includes(product.status) ? "marketing_done" : product.status,
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

  const hasContent = content.captions && content.email;

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl bg-card border border-border space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary" />
          {lang === "es" ? "Generador de Marketing" : "Marketing Generator"}
        </h3>

        <TipBox lang={lang}>
          {lang === "es"
            ? "Elige un tono y la IA creará publicaciones, un email y textos publicitarios para tu producto."
            : "Pick a tone and AI will create social posts, an email, and ad copy for your product."}
        </TipBox>

        <div className="space-y-2">
          <Label>{lang === "es" ? "Tono de Voz" : "Tone of Voice"}</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(TONES[lang] || TONES.en).map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={generate} disabled={generating} className="w-full gap-2">
          {hasContent ? <RefreshCw className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          {hasContent
            ? (lang === "es" ? "Regenerar" : "Regenerate")
            : (lang === "es" ? "Generar Marketing" : "Generate Marketing")}
        </Button>
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

      {generating && (
        <LoadingSpinner text={lang === "es" ? "Creando contenido..." : "Creating content..."} />
      )}

      {hasContent && !generating && (
        <div className="space-y-5 animate-fade-in">
          {/* Social Captions */}
          <ContentBlock
            label={lang === "es" ? "Publicaciones en Redes Sociales" : "Social Media Captions"}
            value={content.captions}
            onChange={(v) => setContent({ ...content, captions: v })}
            onCopy={() => copyToClipboard(content.captions, "captions")}
            copied={copied === "captions"}
            rows={8}
          />

          {/* Email */}
          <ContentBlock
            label={lang === "es" ? "Campaña de Email" : "Email Campaign"}
            value={content.email}
            onChange={(v) => setContent({ ...content, email: v })}
            onCopy={() => copyToClipboard(content.email, "email")}
            copied={copied === "email"}
            rows={10}
          />

          {/* Ad Copy */}
          <ContentBlock
            label={lang === "es" ? "Texto Publicitario" : "Ad Copy"}
            value={content.adCopy}
            onChange={(v) => setContent({ ...content, adCopy: v })}
            onCopy={() => copyToClipboard(content.adCopy, "adCopy")}
            copied={copied === "adCopy"}
            rows={5}
          />

          <WhySuggestion explanation={explanation} lang={lang} />
          <FeedbackWidget feature="marketing_generator" productId={product.id} lang={lang} />

          <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
            {saving && <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
            {lang === "es" ? "Guardar y Continuar" : "Save & Continue"}
          </Button>
        </div>
      )}
    </div>
  );
}

function ContentBlock({ label, value, onChange, onCopy, copied, rows }) {
  return (
    <div className="p-5 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-2">
        <Label>{label}</Label>
        <button onClick={onCopy} className="text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} />
    </div>
  );
}