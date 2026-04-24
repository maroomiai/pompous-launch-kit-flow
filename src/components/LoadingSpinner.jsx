import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ text = "Working on it...", size = "default" }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20" />
        <Loader2 className="w-12 h-12 text-primary animate-spin absolute inset-0" />
      </div>
      <p className="text-sm text-muted-foreground font-medium">{text}</p>
    </div>
  );
}