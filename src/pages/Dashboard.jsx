import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Plus, TrendingUp, MessageSquare, Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../lib/i18n";
import { useUser } from "../lib/hooks/useUser";
import { useProducts } from "../lib/hooks/useProducts";
import StatCard from "../components/dashboard/StatCard";
import ProgressCard from "../components/dashboard/ProgressCard";
import ProductPreviewCard from "../components/dashboard/ProductPreviewCard";
import EmptyState from "../components/EmptyState";
import OnboardingModal from "../components/OnboardingModal";

export default function Dashboard() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user } = useUser();
  const { data: products = [], isLoading, error } = useProducts();

  const lang = user?.language || "en";
  const { t } = useTranslation(lang);

  // Show onboarding once we know the user hasn't completed it and has no products
  const shouldShowOnboarding = user && !user.onboarded && products.length === 0 && !isLoading;

  const completeOnboarding = async () => {
    await base44.auth.updateMe({ onboarded: true });
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    setShowOnboarding(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium flex-1">
            {lang === "es" ? "Error al cargar el panel." : "Failed to load dashboard."}
          </p>
          <button onClick={() => window.location.reload()} className="text-sm underline font-medium hover:no-underline shrink-0">
            {lang === "es" ? "Recargar" : "Reload"}
          </button>
        </div>
      </div>
    );
  }

  // Derive "complete" count from fields rather than status alone,
  // to stay accurate even before ProductSummary writes the status.
  const completedProducts = products.filter(
    (p) => p.listing_title && (p.selling_price || p.suggested_price) && p.marketing_captions
  ).length;

  const listedProducts = products.filter((p) => p.listing_title).length;
  const pricedProducts = products.filter((p) => p.suggested_price || p.selling_price).length;

  const progressSteps = [
    { label: t("step_add_product"), done: products.length > 0 },
    { label: t("step_generate_listing"), done: listedProducts > 0 },
    { label: t("step_suggest_price"), done: pricedProducts > 0 },
    { label: t("step_create_marketing"), done: products.some((p) => p.marketing_captions) },
    { label: t("step_customer_replies"), done: false },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {(showOnboarding || shouldShowOnboarding) && (
        <OnboardingModal lang={lang} onComplete={completeOnboarding} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            {user?.full_name
              ? `${lang === "es" ? "Hola" : "Hey"}, ${user.full_name.split(" ")[0]}! 👋`
              : t("welcome_title")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{t("welcome_subtitle")}</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats + Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatCard icon={Package} label={t("dashboard_products")} value={products.length} color="primary" />
              <StatCard icon={TrendingUp} label={lang === "es" ? "Con Precio" : "Priced"} value={pricedProducts} color="accent" />
              <StatCard icon={Sparkles} label={lang === "es" ? "Completos" : "Complete"} value={completedProducts} color="success" />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/products/new"
                className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t("btn_add_product")}</p>
                  <p className="text-xs text-muted-foreground">
                    {lang === "es" ? "Comienza un nuevo producto" : "Start a new product"}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to="/customer-assistant"
                className="flex items-center gap-3 p-4 rounded-xl bg-accent/5 border border-accent/10 hover:bg-accent/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t("nav_customer")}</p>
                  <p className="text-xs text-muted-foreground">
                    {lang === "es" ? "Prepara respuestas con IA" : "Prepare AI-powered replies"}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>

            {/* Products List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">{t("dashboard_products")}</h2>
                <Link to="/products" className="text-xs text-primary font-medium hover:underline">
                  {t("btn_view_all")} →
                </Link>
              </div>
              <div className="space-y-2">
                {products.slice(0, 5).map((product) => (
                  <ProductPreviewCard key={product.id} product={product} lang={lang} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Progress */}
          <div className="space-y-6">
            <ProgressCard steps={progressSteps} lang={lang} />
          </div>
        </div>
      )}
    </div>
  );
}