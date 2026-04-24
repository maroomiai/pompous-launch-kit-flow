import { useState, useEffect } from "react";
import { Globe, User, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation, LANGUAGES } from "../lib/i18n";
import { useUser } from "../lib/hooks/useUser";
import { toast } from "sonner";

export default function Settings() {
  const { user, isLoading: loading } = useUser();
  const queryClient = useQueryClient();
  const [selectedLang, setSelectedLang] = useState(user?.language || "en");

  const lang = selectedLang;
  const { t } = useTranslation(lang);

  useEffect(() => {
    if (user?.language) setSelectedLang(user.language);
  }, [user?.language]);

  const saveLang = async (newLang) => {
    const prev = selectedLang;
    setSelectedLang(newLang);
    try {
      await base44.auth.updateMe({ language: newLang });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success(newLang === "es" ? "Idioma actualizado" : "Language updated");
    } catch (err) {
      console.error("Failed to update language:", err);
      setSelectedLang(prev);
      toast.error(newLang === "es" ? "No se pudo actualizar el idioma." : "Couldn't update language.");
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{t("nav_settings")}</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {lang === "es" ? "Personaliza tu experiencia" : "Customize your experience"}
      </p>

      <div className="space-y-6">
        {/* Profile */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{user?.full_name || "User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="p-5 rounded-xl bg-card border border-border space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">{t("language")}</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {lang === "es"
              ? "Cambia el idioma de la interfaz y el contenido generado por IA."
              : "Change the language for the interface and AI-generated content."}
          </p>
          <Select value={selectedLang} onValueChange={saveLang}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.flag} {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Logout */}
        <Button variant="outline" onClick={handleLogout} className="w-full gap-2 text-destructive hover:text-destructive">
          <LogOut className="w-4 h-4" />
          {lang === "es" ? "Cerrar Sesión" : "Log Out"}
        </Button>
      </div>
    </div>
  );
}