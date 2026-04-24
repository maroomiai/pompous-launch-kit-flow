import { Link } from "react-router-dom";
import { ArrowRight, Package } from "lucide-react";

const statusColors = {
  draft: "bg-muted text-muted-foreground",
  listing_done: "bg-primary/10 text-primary",
  priced: "bg-accent/10 text-accent",
  marketing_done: "bg-success/10 text-success",
  complete: "bg-success text-success-foreground",
};

const statusLabels = {
  en: { draft: "Draft", listing_done: "Listed", priced: "Priced", marketing_done: "Marketing Done", complete: "Complete" },
  es: { draft: "Borrador", listing_done: "Listado", priced: "Con Precio", marketing_done: "Marketing Listo", complete: "Completo" },
};

export default function ProductPreviewCard({ product, lang = "en" }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-md hover:border-primary/20 transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
        {product.image_url ? (
          <img src={product.image_url} alt="" className="w-full h-full rounded-xl object-cover" />
        ) : (
          <Package className="w-6 h-6 text-primary/40" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{product.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[product.status] || statusColors.draft}`}>
            {statusLabels[lang]?.[product.status] || product.status}
          </span>
          {product.selling_price && (
            <span className="text-xs text-muted-foreground">${product.selling_price}</span>
          )}
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </Link>
  );
}