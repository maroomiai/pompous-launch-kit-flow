import { useState } from "react";
import { MessageSquare, Plus, Sparkles, Star, Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "../lib/i18n";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import EmptyState from "../components/EmptyState";
import WhySuggestion from "../components/WhySuggestion";
import LoadingSpinner from "../components/LoadingSpinner";
import TipBox from "../components/TipBox";
import FeedbackWidget from "../components/FeedbackWidget";
import TemplateCard from "../components/customer/TemplateCard";
import { useUser } from "../lib/hooks/useUser";

const SCENARIOS = ["product_inquiry", "order_status", "return_request", "complaint", "thank_you", "shipping_info", "custom"];

export default function CustomerAssistant() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState(null);
  const [form, setForm] = useState({ scenario: "", customerMessage: "" });
  const [generatedReply, setGeneratedReply] = useState("");
  const [explanation, setExplanation] = useState("");

  const lang = user?.language || "en";
  const { t } = useTranslation(lang);

  const { data: templates = [], isLoading, error, refetch } = useQuery({
    queryKey: ["customerTemplates"],
    queryFn: () => base44.entities.CustomerTemplate.list("-created_date", 50),
    staleTime: 60 * 1000,
  });

  const generateReply = async () => {
    if (!form.scenario || !form.customerMessage) return;
    setGenerating(true);
    setGenError(null);
    const langName = lang === "es" ? "Spanish" : "English";
    try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a friendly customer service expert helping a small business owner respond to customers. Write in ${langName}.

Scenario: ${form.scenario}
Customer Message: "${form.customerMessage}"

Generate:
1. A professional, warm, helpful suggested reply (2-3 paragraphs max)
2. A brief explanation of why this reply works well (1-2 sentences, for the business owner)

The reply should be:
- Polite and empathetic
- Clear and actionable
- Professional but warm
- Appropriate for the scenario

The business owner will review and edit before sending.`,
      response_json_schema: {
        type: "object",
        properties: {
          reply: { type: "string" },
          explanation: { type: "string" },
        },
      },
    });
    setGeneratedReply(result.reply);
    setExplanation(result.explanation);
    } catch (err) {
      console.error("Reply generation failed:", err);
      setGenError(err.message || (lang === "es" ? "Error al generar. Intenta de nuevo." : "Generation failed. Please try again."));
    } finally {
      setGenerating(false);
    }
  };

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["customerTemplates"] });

  const saveTemplate = async () => {
    try {
      await base44.entities.CustomerTemplate.create({
        title: `${t(`scenario_${form.scenario}`)} - ${form.customerMessage.substring(0, 40)}...`,
        scenario: form.scenario,
        customer_message: form.customerMessage,
        suggested_reply: generatedReply,
        explanation,
      });
      await invalidate();
      setShowForm(false);
      setForm({ scenario: "", customerMessage: "" });
      setGeneratedReply("");
      setExplanation("");
      toast.success(lang === "es" ? "Plantilla guardada" : "Template saved");
    } catch (err) {
      console.error("Failed to save template:", err);
      toast.error(lang === "es" ? "No se pudo guardar la plantilla." : "Couldn't save template.");
    }
  };

  const deleteTemplate = async (id) => {
    try {
      await base44.entities.CustomerTemplate.delete(id);
      await invalidate();
    } catch (err) {
      console.error("Failed to delete template:", err);
      toast.error(lang === "es" ? "No se pudo eliminar." : "Couldn't delete.");
    }
  };

  const toggleFavorite = async (template) => {
    try {
      await base44.entities.CustomerTemplate.update(template.id, { is_favorite: !template.is_favorite });
      await invalidate();
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      toast.error(lang === "es" ? "No se pudo actualizar." : "Couldn't update.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium flex-1">
            {lang === "es" ? "Error al cargar las plantillas." : "Failed to load templates."}
          </p>
          <button onClick={() => refetch()} className="text-sm underline font-medium hover:no-underline">
            {lang === "es" ? "Reintentar" : "Retry"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("nav_customer")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "es"
              ? "Genera respuestas profesionales para tus clientes con IA"
              : "Generate professional customer responses with AI"}
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          {lang === "es" ? "Nueva Respuesta" : "New Response"}
        </Button>
      </div>

      {/* Generator Form */}
      {showForm && (
        <div className="p-5 rounded-xl bg-card border border-border mb-6 space-y-4 animate-fade-in">
          <h3 className="font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            {lang === "es" ? "Generar Respuesta al Cliente" : "Generate Customer Response"}
          </h3>

          <TipBox lang={lang}>
            {lang === "es"
              ? "Pega el mensaje de tu cliente y elige el escenario. La IA sugerirá una respuesta que puedes editar antes de enviar."
              : "Paste your customer's message and pick the scenario. AI will suggest a reply you can edit before sending."}
          </TipBox>

          <div className="space-y-2">
            <Label>{t("customer_scenario")}</Label>
            <Select value={form.scenario} onValueChange={(v) => setForm({ ...form, scenario: v })}>
              <SelectTrigger>
                <SelectValue placeholder={lang === "es" ? "Selecciona escenario" : "Select scenario"} />
              </SelectTrigger>
              <SelectContent>
                {SCENARIOS.map((s) => (
                  <SelectItem key={s} value={s}>{t(`scenario_${s}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("customer_message")}</Label>
            <Textarea
              value={form.customerMessage}
              onChange={(e) => setForm({ ...form, customerMessage: e.target.value })}
              placeholder={lang === "es"
                ? "Pega o escribe el mensaje del cliente aquí..."
                : "Paste or type the customer message here..."}
              rows={4}
            />
          </div>

          <Button
            onClick={generateReply}
            disabled={generating || !form.scenario || !form.customerMessage}
            className="w-full gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {lang === "es" ? "Generar Respuesta" : "Generate Response"}
          </Button>

          {genError && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{genError}</span>
                <button onClick={generateReply} className="ml-3 underline font-medium hover:no-underline">
                  {lang === "es" ? "Reintentar" : "Retry"}
                </button>
              </div>
            </div>
          )}

          {generating && (
            <LoadingSpinner text={lang === "es" ? "Preparando respuesta..." : "Preparing response..."} />
          )}

          {generatedReply && !generating && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label>{t("suggested_reply")}</Label>
                <Textarea
                  value={generatedReply}
                  onChange={(e) => setGeneratedReply(e.target.value)}
                  rows={6}
                  className="bg-primary/5 border-primary/10"
                />
                <p className="text-xs text-muted-foreground">
                  {lang === "es"
                    ? "✏️ Puedes editar esta respuesta antes de guardarla o enviarla."
                    : "✏️ You can edit this response before saving or sending."}
                </p>
              </div>

              <WhySuggestion explanation={explanation} lang={lang} />

              <div className="flex gap-3">
                <Button onClick={saveTemplate} variant="outline" className="flex-1 gap-2">
                  <Star className="w-4 h-4" />
                  {lang === "es" ? "Guardar como Plantilla" : "Save as Template"}
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedReply);
                  }}
                  className="flex-1 gap-2"
                >
                  <Send className="w-4 h-4" />
                  {lang === "es" ? "Copiar para Enviar" : "Copy to Send"}
                </Button>
              </div>

              <FeedbackWidget feature="customer_assistant" lang={lang} />
            </div>
          )}
        </div>
      )}

      {/* Saved Templates */}
      {templates.length === 0 && !showForm ? (
        <EmptyState
          icon={MessageSquare}
          title={lang === "es" ? "Sin plantillas guardadas" : "No saved templates"}
          description={lang === "es"
            ? "Genera tu primera respuesta al cliente con IA."
            : "Generate your first AI-powered customer response."}
          actionLabel={lang === "es" ? "Nueva Respuesta" : "New Response"}
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="space-y-3">
          {templates.length > 0 && (
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">
              {lang === "es" ? "Plantillas Guardadas" : "Saved Templates"} ({templates.length})
            </h3>
          )}
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              lang={lang}
              onDelete={() => deleteTemplate(template.id)}
              onToggleFavorite={() => toggleFavorite(template)}
            />
          ))}
        </div>
      )}
    </div>
  );
}