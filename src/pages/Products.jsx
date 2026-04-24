import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Package, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "../lib/i18n";
import { useUser } from "../lib/hooks/useUser";
import { useProducts } from "../lib/hooks/useProducts";
import ProductPreviewCard from "../components/dashboard/ProductPreviewCard";
import EmptyState from "../components/EmptyState";

export default function Products() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { user } = useUser();
  const { data: products = [], isLoading, error } = useProducts();

  const lang = user?.language || "en";
  const { t } = useTranslation(lang);

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

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
          <p className="text-sm font-medium">
            {lang === "es" ? "No se pudieron cargar los productos." : "Failed to load products."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("nav_products")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "es" ? `${products.length} productos` : `${products.length} products`}
          </p>
        </div>
        <Button onClick={() => navigate("/products/new")} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          {t("btn_add_product")}
        </Button>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title={t("no_products_title")}
          description={t("no_products_desc")}
          actionLabel={t("btn_add_product")}
          onAction={() => navigate("/products/new")}
        />
      ) : (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={lang === "es" ? "Buscar productos..." : "Search products..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              aria-label={lang === "es" ? "Buscar productos" : "Search products"}
            />
          </div>
          <div className="space-y-2">
            {filtered.map((product) => (
              <ProductPreviewCard key={product.id} product={product} lang={lang} />
            ))}
            {filtered.length === 0 && search && (
              <p className="text-center text-sm text-muted-foreground py-8">
                {lang === "es" ? "No se encontraron productos." : "No products found."}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}