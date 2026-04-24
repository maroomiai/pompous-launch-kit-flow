import { Link } from "react-router-dom";
import { Home, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Rocket className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-3">404</h1>
        <p className="text-muted-foreground mb-6">
          This page doesn't exist. Let's get you back on track.
        </p>
        <Link to="/">
          <Button className="gap-2">
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}