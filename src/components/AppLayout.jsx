import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, MessageSquare, Settings, Menu, X, TrendingUp, Palette, Brain } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "../lib/i18n";
import { useUser } from "../lib/hooks/useUser";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, labelKey: "nav_dashboard" },
  { path: "/products", icon: Package, labelKey: "nav_products" },
  { path: "/market-insights", icon: TrendingUp, labelKey: "nav_market" },
  { path: "/branding", icon: Palette, labelKey: "nav_branding" },
  { path: "/ai-advisor", icon: Brain, labelKey: "nav_ai_advisor" },
  { path: "/customer-assistant", icon: MessageSquare, labelKey: "nav_customer" },
  { path: "/settings", icon: Settings, labelKey: "nav_settings" },
];

export default function AppLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUser();
  const lang = user?.language || "en";
  const { t } = useTranslation(lang);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-sidebar-border bg-sidebar fixed h-full z-30">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <span className="text-white font-black text-sm tracking-tight">LP</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-sidebar-foreground">{t("app_name")}</h1>
            <p className="text-xs text-sidebar-foreground/50">{t("app_tagline")}</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-accent text-white"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 mx-3 mb-4 rounded-xl bg-sidebar-accent border border-sidebar-border">
          <p className="text-xs font-medium text-accent">{t("tip")}</p>
          <p className="text-xs text-sidebar-foreground/50 mt-1">
            {lang === "es" 
              ? "Agrega un producto para desbloquear todas las funciones de IA."
              : "Add a product to unlock all AI features."}
          </p>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-40 flex items-center px-4 gap-3">
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-xs tracking-tight">LP</span>
          </div>
          <span className="font-bold">{t("app_name")}</span>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <aside className="relative w-64 h-full bg-card border-r border-border" onClick={(e) => e.stopPropagation()}>
            <div className="pt-20 px-3 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="pt-16 lg:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}