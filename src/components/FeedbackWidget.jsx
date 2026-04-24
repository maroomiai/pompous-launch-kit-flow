import { Star } from "lucide-react";
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function FeedbackWidget({ feature, productId, lang = "en" }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    await base44.entities.Feedback.create({
      feature,
      rating,
      comment,
      product_id: productId,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success text-sm font-medium">
        <Star className="w-4 h-4 fill-current" />
        {lang === "es" ? "¡Gracias por tu opinión!" : "Thanks for your feedback!"}
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border border-border bg-card">
      <p className="text-sm font-medium mb-2">
        {lang === "es" ? "¿Te fue útil?" : "Was this helpful?"}
      </p>
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            onClick={() => setRating(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-6 h-6 ${
                i <= (hover || rating)
                  ? "text-warning fill-warning"
                  : "text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
      </div>
      {rating > 0 && (
        <div className="space-y-2 animate-fade-in">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={lang === "es" ? "Comentario opcional..." : "Optional comment..."}
            className="text-sm resize-none"
            rows={2}
          />
          <Button size="sm" onClick={handleSubmit}>
            {lang === "es" ? "Enviar" : "Submit"}
          </Button>
        </div>
      )}
    </div>
  );
}