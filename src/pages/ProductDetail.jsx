import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useTranslation } from "../lib/i18n";
import { useUser } from "../lib/hooks/useUser";
import { useProduct } from "../lib/hooks/useProducts";
import StepIndicator from "../components/StepIndicator";
import ListingGenerator from "../components/product/ListingGenerator";
import PricingEngine from "../components/product/PricingEngine";
import MarketingGenerator from "../components/product/MarketingGenerator";
import ProductSummary from "../components/product/ProductSummary";

// Map product status → default tab index
const STATUS_TAB = {
  draft: 0,
  listing_done: 1,
  priced: 2,
  marketing_done: 3,
  complete: 3,
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useUser();
  const { data: product, isLoading, error, refetch } = useProduct(id);

  const lang = user?.language || "en";
  const { t } = useTranslation(lang);

  const [activeTab, setActiveTab] = useState(0);

  // Sync tab to product status once loaded
  useEffect(() => {
    if (product?.status != null) {
      setActiveTab(STATUS_TAB[product.status] ?? 0);
    }
  }, [product?.status]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium flex-1">
            {lang === "es" ? "No se encontró el producto." : "Product not found or failed to load."}
          </p>
          {error && (
            <button onClick={() => refetch()} className="text-sm underline font-medium hover:no-underline shrink-0">
              {lang === "es" ? "Reintentar" : "Retry"}
            </button>
          )}
        </div>
      </div>
    );
  }

  const steps = [
    lang === "es" ? "Listado" : "Listing",
    lang === "es" ? "Precio" : "Pricing",
    lang === "es" ? "Marketing" : "Marketing",
    lang === "es" ? "Resumen" : "Summary",
  ];

  const tabContent = [
    <ListingGenerator key="listing" product={product} lang={lang} onUpdate={refetch} onNext={() => setActiveTab(1)} />,
    <PricingEngine key="pricing" product={product} lang={lang} onUpdate={refetch} onNext={() => setActiveTab(2)} />,
    <MarketingGenerator key="marketing" product={product} lang={lang} onUpdate={refetch} onNext={() => setActiveTab(3)} />,
    <ProductSummary key="summary" product={product} lang={lang} />,
  ];

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <button
        onClick={() => navigate("/products")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors cursor-pointer"
        aria-label={t("btn_back")}
      >
        <ArrowLeft className="w-4 h-4" />
        {t("btn_back")}
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t(`category_${product.category}`)}
        </p>
      </div>

      <div className="mb-6">
        <StepIndicator steps={steps} currentStep={activeTab} />
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6" role="tablist" aria-label="Product workflow steps">
        {steps.map((step, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={activeTab === i}
            onClick={() => setActiveTab(i)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === i
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {step}
          </button>
        ))}
      </div>

      <div className="animate-fade-in" role="tabpanel">{tabContent[activeTab]}</div>
    </div>
  );
}