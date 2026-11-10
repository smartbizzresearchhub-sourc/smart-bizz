import { useLayoutEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import ParticleField from "../components/ParticleField";
import MagneticButton from "../components/MagneticButton";
import { site } from "../config/site";
import { useInterest } from "../context/InterestContext";
import { scrollToSection } from "../hooks/useActiveSection";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const particleColors = ["#C99B48", "#B98A35", "#7FB6DE"];

export default function Hero() {
  const ref = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const { startConversation } = useInterest();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(".hero-reveal", { opacity: 1, clearProps: "transform" });
        return;
      }
      gsap.fromTo(
        ".hero-reveal",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.12, ease: "power3.out", delay: 0.2 },
      );
    }, ref);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="home"
      ref={ref}
      aria-label="Introduction"
      className="grain relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      <motion.div aria-hidden className="absolute inset-0" style={{ scale: bgScale }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,255,255,.55)_0%,rgba(255,255,255,0)_55%)]" />
        <div
          className="anim-spin-slow absolute left-1/2 top-[34%] h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2 opacity-40"
          style={{
            background:
              "repeating-conic-gradient(from 0deg, rgba(10,134,199,.06) 0deg 4deg, transparent 4deg 22deg)",
            maskImage: "radial-gradient(circle, black 0%, transparent 55%)",
            WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 55%)",
          }}
        />
        <ParticleField mode="float" colors={particleColors} count={90} speed={0.5} size={[0.5, 2.1]} />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-28 text-center"
      >
        <div className="mb-8 h-[200px] w-[200px] sm:h-[250px] sm:w-[250px]">
          <img src={site.logo} alt={`${site.name} logo`} className="h-full w-full object-contain" />
        </div>
        <p className="hero-reveal eyebrow mb-5">Look before you leap.</p>
        <h1 className="hero-reveal font-serif text-[2.6rem] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[5.4rem]">
          Intelligence behind <br className="hidden sm:block" />
          <span className="gold-text italic">every great idea.</span>
        </h1>
        <p className="hero-reveal mt-6 font-serif text-xl italic text-electric sm:text-2xl">
          Researching possibilities. Developing ideas. Building businesses.
        </p>
        <blockquote
          lang="ta"
          className="hero-reveal mt-6 font-tamil text-[0.98rem] font-medium leading-[1.9] text-white/80 min-[400px]:text-[1.05rem] sm:text-xl sm:leading-[1.85]"
        >
          <span className="block whitespace-nowrap">எண்ணித் துணிக கருமம் துணிந்தபின்</span>
          <span className="block whitespace-nowrap">எண்ணுவம் என்பது இழுக்கு.</span>
        </blockquote>
        <div className="hero-reveal mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <MagneticButton onClick={() => scrollToSection("about")}>Explore our world</MagneticButton>
          <MagneticButton variant="ghost" onClick={() => startConversation()}>
            Let's build something
          </MagneticButton>
        </div>
      </motion.div>

      <button
        type="button"
        onClick={() => scrollToSection("about")}
        className="hero-reveal absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-white/50 transition-colors hover:text-gold"
        aria-label="Scroll to About Us"
      >
        <span className="relative flex h-10 w-6 justify-center rounded-full border border-white/30 pt-2">
          <span
            className="block h-2 w-0.5 rounded-full bg-gold"
            style={{ animation: "scroll-dot 1.8s ease-in-out infinite" }}
          />
        </span>
        Scroll
      </button>
    </section>
  );
}
