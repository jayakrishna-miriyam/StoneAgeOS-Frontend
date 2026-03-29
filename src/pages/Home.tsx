import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "../components/Card";

const featureItems = [
  {
    title: "Location-aware planning",
    description: "Generate practical plans based on your location, available time, budget, and selected priorities."
  },
  {
    title: "Actionable alternatives",
    description: "Get multiple nearby options with travel estimates, cost signals, and direct navigation links."
  },
  {
    title: "Operational history",
    description: "Review previously generated plans with dynamic search to compare decisions over time."
  }
];

const processItems = [
  {
    title: "1. Define constraints",
    description: "Enter location, budget, available minutes, energy, and mission priorities."
  },
  {
    title: "2. Generate plan",
    description: "The system ranks nearby options and returns a structured tactical output."
  },
  {
    title: "3. Execute quickly",
    description: "Use distance, ETA, weather, and fallback guidance to make faster field decisions."
  }
];

const heroImages = [
  "/assets/icons/thiings/futuristic-caveman/barbarian.png",
  "/assets/icons/thiings/futuristic-caveman/indigenous.png",
  "/assets/icons/thiings/futuristic-caveman/totem-pole.png",
  "/assets/icons/thiings/futuristic-caveman/motif-stone-signal.png"
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [upcomingImageIndex, setUpcomingImageIndex] = useState<number | null>(null);
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);

  useEffect(() => {
    document.title = "StoneAgeOS | Tactical Survival Planning";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "StoneAgeOS helps you generate location-aware survival plans with clear priorities, alternatives, and actionable next steps."
      );
    }
  }, []);

  useEffect(() => {
    let transitionTimeoutId: number | null = null;
    const intervalId = window.setInterval(() => {
      const next = (currentImageIndex + 1) % heroImages.length;
      setUpcomingImageIndex(next);
      setIsImageTransitioning(true);

      transitionTimeoutId = window.setTimeout(() => {
        setCurrentImageIndex(next);
        setIsImageTransitioning(false);
        setUpcomingImageIndex(null);
      }, 750);
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
      if (transitionTimeoutId != null) {
        window.clearTimeout(transitionTimeoutId);
      }
    };
  }, [currentImageIndex]);

  return (
    <div className="space-y-12 pb-12 relative">
      <img
        src="/assets/icons/thiings/futuristic-caveman/motif-cave-grid.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 w-52 h-52 opacity-[0.08]"
      />

      <section className="py-4 md:py-8" aria-labelledby="hero-title">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 id="hero-title" className="text-4xl md:text-5xl font-display font-bold tracking-tight text-on-surface">
              Build safer survival plans in minutes.
            </h1>
            <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">
              StoneAgeOS turns your constraints into a structured action plan with alternatives, route context, and
              fallback recommendations.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/planner"
                className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-on-primary hover:opacity-90 focus-visible:outline-2 focus-visible:outline-primary"
              >
                Start Planning
              </Link>
              <Link
                to="/history"
                className="inline-flex items-center rounded-xl border border-outline-variant bg-surface px-5 py-3 text-sm font-semibold text-on-surface hover:bg-surface-variant focus-visible:outline-2 focus-visible:outline-primary"
              >
                View History
              </Link>
            </div>
          </div>

          <div className="relative h-72 md:h-96 flex items-center justify-center overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl hero-image-glow" />
            </div>
            <img
              src={heroImages[currentImageIndex]}
              alt="StoneAgeOS hero visual"
              className={`absolute h-full w-full object-contain hero-image-float transition-all duration-700 ease-out ${
                isImageTransitioning ? "opacity-0 translate-y-2 scale-[0.96] blur-[1px]" : "opacity-100 translate-y-0 scale-100 blur-0"
              }`}
            />
            {upcomingImageIndex != null && (
              <img
                src={heroImages[upcomingImageIndex]}
                alt="StoneAgeOS hero visual"
                className={`absolute h-full w-full object-contain hero-image-float transition-all duration-700 ease-out ${
                  isImageTransitioning ? "opacity-100 translate-y-0 scale-100 blur-0" : "opacity-0 -translate-y-2 scale-[1.05] blur-[1px]"
                }`}
              />
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="features-title" className="space-y-5">
        <h2 id="features-title" className="text-2xl md:text-3xl font-display font-bold tracking-tight text-on-surface">
          Core capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featureItems.map((item) => (
            <Card key={item.title} variant="surface" className="bg-white border border-outline-variant/80">
              <h3 className="text-lg font-display font-semibold text-on-surface">{item.title}</h3>
              <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="how-title" className="space-y-5">
        <h2 id="how-title" className="text-2xl md:text-3xl font-display font-bold tracking-tight text-on-surface">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {processItems.map((item) => (
            <Card key={item.title} variant="surface" className="bg-white border border-outline-variant/80">
              <h3 className="text-base font-display font-semibold text-on-surface">{item.title}</h3>
              <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="cta-title"
        className="rounded-3xl border border-primary/20 bg-primary-container/40 p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div className="space-y-2">
          <h2 id="cta-title" className="text-2xl md:text-3xl font-display font-bold tracking-tight text-on-surface">
            Ready to generate your next plan?
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant">
            Start with your current constraints and get a tactical recommendation immediately.
          </p>
        </div>
        <Link
          to="/planner"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary hover:opacity-90 focus-visible:outline-2 focus-visible:outline-primary"
        >
          Open Planner
        </Link>
      </section>
    </div>
  );
}
