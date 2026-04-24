import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Package, TrendingUp, Palette, Sparkles,
  MessageSquare, Brain, BarChart2, CheckCircle2, ChevronDown
} from "lucide-react";

/* ─── animation ──────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── data ────────────────────────────────────────────────── */
const features = [
  { icon: Package,      title: "Product Listing AI",       desc: "SEO-ready titles, descriptions, and bullet points written for your product — in seconds.",          color: "bg-blue-50 text-blue-600 border-blue-100" },
  { icon: TrendingUp,   title: "Smart Pricing Engine",      desc: "Market-benchmarked pricing with margin estimates and a clear rationale you can act on.",             color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { icon: Palette,      title: "Branding & Positioning",    desc: "AI-crafted brand voice, tagline, and market positioning built around your specific product.",         color: "bg-violet-50 text-violet-600 border-violet-100" },
  { icon: Sparkles,     title: "Marketing Content",         desc: "Social captions, email drafts, and ad copy — ready to post, tailored to your audience.",             color: "bg-rose-50 text-rose-600 border-rose-100" },
  { icon: MessageSquare,title: "Customer Reply Templates",  desc: "Professional response templates for inquiries, complaints, returns, and more — copy and send.",       color: "bg-amber-50 text-amber-600 border-amber-100" },
  { icon: Brain,        title: "AI Integration Advisor",    desc: "Find out exactly which AI tools fit your business — with plain-language explanations of each one.",   color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { icon: BarChart2,    title: "Market Intelligence",       desc: "Competitive signals, opportunity gaps, and strategic insights grounded in your product category.",    color: "bg-teal-50 text-teal-600 border-teal-100" },
];

const steps = [
  { n: "01", title: "Add your product",       desc: "Fill in a simple form — name, category, price range, target audience. No jargon, no complexity." },
  { n: "02", title: "AI does the research",   desc: "We analyse your market, benchmark competitors, and build a strategy specific to your product." },
  { n: "03", title: "Review your plan",       desc: "Get pricing, branding, marketing content, and listing copy — all explained in plain language." },
  { n: "04", title: "Launch with confidence", desc: "Use the ready-made content and strategic roadmap to take your product to market." },
];

const audiences = [
  { emoji: "🛍️", label: "Selling on Amazon, Etsy, or Shopify" },
  { emoji: "💡", label: "Launching your first product or idea" },
  { emoji: "📦", label: "Adding a new product to your range" },
  { emoji: "🌐", label: "Building a brand from scratch" },
  { emoji: "📣", label: "Creating marketing without a team" },
  { emoji: "🔍", label: "Understanding your competitive market" },
];

const pillars = [
  { title: "Plain language, always",     desc: "Every AI output is explained in simple terms — no MBA, no marketing background required." },
  { title: "You stay in control",        desc: "AI makes suggestions. You review and decide. Nothing is published automatically." },
  { title: "English & Spanish",          desc: "Fully bilingual — switch languages at any time. AI content is generated in your chosen language." },
  { title: "One platform, every tool",   desc: "Listing, pricing, branding, marketing, and customer replies — all in one place." },
];

/* ─── component ───────────────────────────────────────────── */
export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-inter overflow-x-hidden">

      {/* ── NAV ──────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/97 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm">LP</span>
            </div>
            <span className="font-extrabold text-lg text-primary tracking-tight">LaunchPad</span>
          </div>

          {/* Nav links — hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            <a href="#features" className="hover:text-primary transition-colors duration-150 cursor-pointer">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors duration-150 cursor-pointer">How it works</a>
            <a href="#who-its-for" className="hover:text-primary transition-colors duration-150 cursor-pointer">Who it's for</a>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-2.5">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-sm font-medium text-gray-600 hidden sm:inline-flex cursor-pointer">
                Sign in
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button className="text-sm font-semibold gap-1.5 cursor-pointer">
                Get started free <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-5 bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden">
        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: "radial-gradient(hsl(218,72%,22%) 1.5px, transparent 1.5px)", backgroundSize: "32px 32px" }} />
        {/* glow blobs */}
        <div className="absolute top-16 right-0 w-[520px] h-[520px] bg-accent/6 rounded-full blur-3xl pointer-events-none translate-x-1/3" />
        <div className="absolute -bottom-10 -left-10 w-[360px] h-[360px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative">
          {/* pill badge */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent text-xs font-bold px-4 py-1.5 rounded-full mb-7 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            AI Business Advisor
          </motion.div>

          {/* headline */}
          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] mb-5 tracking-tight text-primary text-balance">
            Launch your product idea<br className="hidden sm:block" />
            with an <span className="text-accent">AI strategy team</span>
          </motion.h1>

          {/* subheadline */}
          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto mb-9 leading-relaxed text-pretty">
            Pricing, branding, product listings, and marketing content — generated for your specific product, explained in plain language.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard">
              <Button size="lg"
                className="bg-accent hover:bg-accent/90 text-white text-base px-8 h-12 shadow-lg shadow-accent/25 font-semibold gap-2 w-full sm:w-auto cursor-pointer">
                Start for free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/market-insights">
              <Button size="lg" variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50 text-base px-8 h-12 font-medium w-full sm:w-auto cursor-pointer">
                See Market Insights
              </Button>
            </Link>
          </motion.div>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="text-xs text-gray-400 mt-5 tracking-wide">
            No credit card · Free to start · English &amp; Spanish
          </motion.p>
        </div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-300">
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </motion.div>
      </section>

      {/* ── WHAT IT DOES (3-col intro) ────────────────────────── */}
      <section className="py-16 px-5 border-y border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
          {[
            { label: "Build your listing", sub: "AI-written titles, descriptions, and bullet points optimised for search and conversion." },
            { label: "Price it right",     sub: "Market-benchmarked pricing with transparent margin calculations and a clear rationale." },
            { label: "Market it fast",     sub: "Social posts, email drafts, and ad copy — ready the moment your product is." },
          ].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.08 }} viewport={{ once: true }}>
              <p className="text-base font-bold text-primary mb-2">{item.label}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section id="features" className="py-24 px-5 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} viewport={{ once: true }} className="mb-12 text-center">
            <p className="text-xs font-bold text-accent uppercase tracking-widest mb-3">Seven tools, one platform</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4 text-balance">
              Every tool your launch needs
            </h2>
            <p className="text-base text-gray-500 max-w-lg mx-auto leading-relaxed">
              From product description to post-launch customer support — LaunchPad guides every step with AI that explains its thinking.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }} viewport={{ once: true }}
                className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 group">
                <div className={`w-10 h-10 rounded-xl border ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-[15px] text-gray-900 mb-1.5 group-hover:text-primary transition-colors duration-200">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-5 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[440px] h-[440px] bg-accent/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[280px] h-[280px] bg-white/4 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-xs font-bold text-accent uppercase tracking-widest mb-3">Simple process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-balance">From idea to launch in 4 steps</h2>
            <p className="text-base text-white/55 mt-4 max-w-md mx-auto">No complicated setup. Start in under a minute.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.1 }} viewport={{ once: true }}
                className="p-6 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/14 transition-colors duration-200">
                <div className="text-3xl font-black text-accent/60 mb-4 leading-none">{s.n}</div>
                <h3 className="font-bold text-white mb-2 text-[15px]">{s.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────────── */}
      <section id="who-its-for" className="py-24 px-5 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }} viewport={{ once: true }}>
              <p className="text-xs font-bold text-accent uppercase tracking-widest mb-3">Built for founders</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-5 leading-tight text-balance">
                If you're launching a product, this is for you
              </h2>
              <p className="text-base text-gray-500 leading-relaxed mb-8">
                LaunchPad is built for people who know their product but aren't sure how to price it, describe it, or market it. You don't need a team — just your idea.
              </p>
              <Link to="/dashboard">
                <Button size="lg" className="gap-2 font-semibold cursor-pointer">
                  Try it free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }} viewport={{ once: true }}
              className="grid sm:grid-cols-2 gap-3">
              {audiences.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/20 hover:bg-white hover:shadow-sm transition-all duration-200">
                  <span className="text-xl shrink-0">{a.emoji}</span>
                  <p className="text-sm text-gray-700 font-medium leading-snug">{a.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PILLARS / WHY TRUST ──────────────────────────────── */}
      <section className="py-20 px-5 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary text-balance">
              Designed to be simple, not simplified
            </h2>
            <p className="text-base text-gray-500 mt-3 max-w-lg mx-auto">
              LaunchPad gives you professional-grade output without the professional-grade complexity.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((p, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.08 }} viewport={{ once: true }}
                className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-md hover:border-primary/15 transition-all duration-200">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-4" />
                <h3 className="font-semibold text-[15px] text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-24 px-5 bg-white border-t border-gray-100">
        <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center">
          {/* logo mark */}
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-7 shadow-lg shadow-primary/20">
            <span className="text-white font-black text-xl">LP</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-primary tracking-tight text-balance">
            Your product is ready.<br className="hidden sm:block" /> Is your strategy?
          </h2>
          <p className="text-lg text-gray-500 mb-9 leading-relaxed max-w-lg mx-auto text-pretty">
            LaunchPad turns your product idea into a complete go-to-market strategy — pricing, branding, content, and more — in minutes.
          </p>

          <Link to="/dashboard">
            <Button size="lg"
              className="bg-accent hover:bg-accent/90 text-white text-base px-12 h-12 shadow-lg shadow-accent/25 font-semibold gap-2 cursor-pointer">
              Start for free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-xs text-gray-400 mt-5 tracking-wide">No credit card required · Cancel anytime</p>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="py-10 px-5 border-t border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-xs">LP</span>
            </div>
            <span className="font-bold text-primary">LaunchPad</span>
          </div>

          {/* links */}
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#features" className="hover:text-gray-700 transition-colors duration-150 cursor-pointer">Features</a>
            <a href="#how-it-works" className="hover:text-gray-700 transition-colors duration-150 cursor-pointer">How it works</a>
            <Link to="/dashboard" className="hover:text-gray-700 transition-colors duration-150">Dashboard</Link>
          </div>

          <p className="text-xs text-gray-400">© 2026 LaunchPad · AI-powered for entrepreneurs</p>
        </div>
      </footer>
    </div>
  );
}