import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation, CATEGORIES } from "../lib/i18n";
import TipBox from "../components/TipBox";
import { useUser } from "../lib/hooks/useUser";

export default function NewProduct() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    features: "",
    keywords: "",
    target_audience: "",
    cost_price: "",
  });

  const lang = user?.language || "en";
  const { t } = useTranslation(lang);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category) return;
    setSaving(true);
    try {
      const product = await base44.entities.Product.create({
        ...form,
        cost_price: form.cost_price ? parseFloat(form.cost_price) : undefined,
        status: "draft",
        language: lang,
      });
      navigate(`/products/${product.id}`);
    } catch (err) {
      console.error("Failed to create product:", err);
      toast.error(lang === "es" ? "No se pudo crear el producto. Intenta de nuevo." : "Couldn't create product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("btn_back")}
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t("step_add_product")}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {lang === "es"
            ? "Cuéntanos sobre tu producto. La IA te ayudará después."
            : "Tell us about your product. AI will help you next."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">{t("product_name")} *</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder={lang === "es" ? 'ej. "Jabón artesanal de lavanda"' : 'e.g. "Handmade Lavender Soap"'}
            required
          />
          <TipBox lang={lang}>
            {lang === "es"
              ? "Usa un nombre descriptivo. Piensa en lo que buscaría tu cliente."
              : "Use a descriptive name. Think about what your customer would search for."}
          </TipBox>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">{t("product_category")} *</Label>
          <Select value={form.category} onValueChange={(v) => updateField("category", v)}>
            <SelectTrigger>
              <SelectValue placeholder={lang === "es" ? "Selecciona una categoría" : "Select a category"} />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {t(`category_${cat}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="features">{t("product_features")}</Label>
          <Textarea
            id="features"
            value={form.features}
            onChange={(e) => updateField("features", e.target.value)}
            placeholder={lang === "es"
              ? "ej. Ingredientes naturales, hecho a mano, aroma suave..."
              : "e.g. Natural ingredients, handmade, gentle scent..."}
            rows={3}
          />
          <TipBox lang={lang}>
            {lang === "es"
              ? "Lista lo que hace especial a tu producto. Separa con comas."
              : "List what makes your product special. Separate with commas."}
          </TipBox>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="keywords">{t("product_keywords")}</Label>
            <Input
              id="keywords"
              value={form.keywords}
              onChange={(e) => updateField("keywords", e.target.value)}
              placeholder={lang === "es" ? "ej. orgánico, regalo, ecológico" : "e.g. organic, gift, eco-friendly"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="audience">{t("product_audience")}</Label>
            <Input
              id="audience"
              value={form.target_audience}
              onChange={(e) => updateField("target_audience", e.target.value)}
              placeholder={lang === "es" ? "ej. Mujeres 25-40 años" : "e.g. Women age 25-40"}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost">{t("cost_price")}</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="cost"
              type="number"
              step="0.01"
              min="0"
              value={form.cost_price}
              onChange={(e) => updateField("cost_price", e.target.value)}
              className="pl-7"
              placeholder="0.00"
            />
          </div>
          <TipBox lang={lang}>
            {lang === "es"
              ? "Incluye el costo de materiales, producción y envío. Esto ayuda a sugerir precios."
              : "Include material, production, and shipping costs. This helps us suggest pricing."}
          </TipBox>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
            {t("btn_back")}
          </Button>
          <Button type="submit" disabled={saving || !form.name || !form.category} className="flex-1 gap-2">
            {saving ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : null}
            {lang === "es" ? "Crear y Continuar" : "Create & Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}