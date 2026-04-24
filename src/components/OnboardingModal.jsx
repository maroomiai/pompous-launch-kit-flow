import { useState } from "react";
import { Package, Sparkles, DollarSign, Megaphone, ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../lib/i18n";

const onboardingSteps = [
  { icon: Package, titleKey: "onboarding_step1_title", descKey: "onboarding_step1_desc", color: "bg-primary/10 text-primary" },
  { icon: Sparkles, titleKey: "onboarding_step2_title", descKey: "onboarding_step2_desc", color: "bg-accent/10 text-accent" },
  { icon: DollarSign, titleKey: "onboarding_step3_title", descKey: "onboarding_step3_desc", color: "bg-success/10 text-success" },
  { icon: Megaphone, titleKey: "onboarding_step4_title", descKey: "onboarding_step4_desc", color: "bg-chart-4/10 text-chart-4" },
];

export default function OnboardingModal({ lang = "en", onComplete }) {
  const [step, setStep] = useState(0);
  const { t } = useTranslation(lang);

  const isLastStep = step === onboardingSteps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
        {/* Hero area */}
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">{t("welcome_title")}</h2>
          <p className="text-sm text-muted-foreground">{t("welcome_subtitle")}</p>
        </div>

        {/* Steps */}
        <div className="px-8 pb-6">
          <div className="space-y-3">
            {onboardingSteps.map((s, i) => {
              const isActive = i === step;
              const isDone = i < step;
              return (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left ${
                    isActive ? "bg-primary/5 border border-primary/20 shadow-sm" : "opacity-60"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t(s.titleKey)}</p>
                    {isActive && (
                      <p className="text-xs text-muted-foreground mt-0.5">{t(s.descKey)}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Dots + Button */}
        <div className="px-8 pb-8 flex items-center justify-between">
          <div className="flex gap-1.5">
            {onboardingSteps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-6 bg-primary" : "w-1.5 bg-muted"
                }`}
              />
            ))}
          </div>
          <Button
            onClick={() => {
              if (isLastStep) onComplete();
              else setStep(step + 1);
            }}
            className="gap-2"
          >
            {isLastStep ? t("btn_get_started") : t("btn_next")}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}