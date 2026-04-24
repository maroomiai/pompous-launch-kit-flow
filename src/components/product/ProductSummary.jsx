import { Check, Package, DollarSign, Megaphone, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";

/**
 * Completion rule: a product is "complete" when it has all three of:
 *   1. A listing title (listing step done)
 *   2. A selling price OR a suggested price (pricing step done)
 *   3. Marketing captions (marketing step done)
 *
 * When these criteria are met, we write status="complete" to the entity
 * so the dashboard "Complete" count is accurate.
 */
function isProductComplete(product) {
  return !!(product.listing_title && (product.selling_price || product.suggested_price) && product.marketing_captions);
}

export default function ProductSummary({ product, lang }) {
  const [copied, setCopied] = useState("");

  // Write "complete" status once when all criteria are met and status isn't already set
  useEffect(() => {
    if (isProductComplete(product) && product.status !== "complete") {
      base44.entities.Product.update(product.id, { status: "complete" }).catch(console.error);
    }
  }, [product.id, product.listing_title, product.selling_price, product.suggested_price, product.marketing_captions, product.status]);

  const copyAll = () => {
    const text = `${product.listing_title || product.name}

${product.short_description || ""}

${product.long_description || ""}

${product.bullet_points || ""}

Price: $${product.selling_price || product.suggested_price || "N/A"}`;
    navigator.clipboard.writeText(text);
    setCopied("all");
    setTimeout(() => setCopied(""), 2000);
  };

  const sections = [
    {
      icon: Package,
      title: lang === "es" ? "Listado" : "Listing",
      done: !!product.listing_title,
      items: [
        { label: lang === "es" ? "Título" : "Title", value: product.listing_title },
        { label: lang === "es" ? "Descripción Corta" : "Short Desc", value: product.short_description },
      ],
    },
    {
      icon: DollarSign,
      title: lang === "es" ? "Precio" : "Pricing",
      done: !!(product.selling_price || product.suggested_price),
      items: [
        { label: lang === "es" ? "Precio de Venta" : "Selling Price", value: product.selling_price ? `$${product.selling_price}` : null },
        { label: lang === "es" ? "Margen" : "Margin", value: product.suggested_margin ? `${product.suggested_margin}%` : null },
      ],
    },
    {
      icon: Megaphone,
      title: "Marketing",
      done: !!product.marketing_captions,
      items: [
        { label: lang === "es" ? "Redes Sociales" : "Social Posts", value: product.marketing_captions ? "✓" : null },
        { label: "Email", value: product.marketing_email ? "✓" : null },
        { label: lang === "es" ? "Publicidad" : "Ad Copy", value: product.marketing_ad_copy ? "✓" : null },
      ],
    },
  ];

  const allDone = sections.every((s) => s.done);

  return (
    <div className="space-y-6">
      {allDone && (
        <div className="p-6 rounded-xl bg-success/5 border border-success/20 text-center animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
            <Check className="w-7 h-7 text-success" />
          </div>
          <h3 className="text-lg font-bold">
            {lang === "es" ? "¡Tu producto está listo!" : "Your product is ready!"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "es"
              ? "Has completado todos los pasos. Copia todo y publica en tu tienda."
              : "You've completed all steps. Copy everything and publish to your store."}
          </p>
          <Button onClick={copyAll} variant="outline" className="mt-4 gap-2">
            {copied === "all" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {lang === "es" ? "Copiar Todo" : "Copy All"}
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {sections.map((section, i) => (
          <div key={i} className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                section.done ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
              }`}>
                {section.done ? <Check className="w-4 h-4" /> : <section.icon className="w-4 h-4" />}
              </div>
              <h4 className="font-semibold text-sm">{section.title}</h4>
              {section.done && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {lang === "es" ? "Completo" : "Done"}
                </Badge>
              )}
            </div>
            <div className="space-y-2 ml-11">
              {section.items.map((item, j) => (
                <div key={j} className="flex items-start gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">{item.label}:</span>
                  <span className="text-xs font-medium truncate">
                    {item.value || (lang === "es" ? "No generado" : "Not generated")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}