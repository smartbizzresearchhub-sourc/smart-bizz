import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Eyebrow, SplitHeading, fadeUp } from "../components/Typography";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const steps = [
  { n: "01", t: "Discover", d: "Understand the idea, problem or opportunity." },
  { n: "02", t: "Research", d: "Gather information, analyse data and investigate possibilities." },
  { n: "03", t: "Develop", d: "Create strategies, models, concepts and solutions." },
  { n: "04", t: "Implement", d: "Transform research and ideas into practical outcomes." },
  { n: "05", t: "Evolve", d: "Evaluate, improve and explore future opportunities." },
];

const wavePath =
  "M100 100 C225 30 225 30 350 100 S475 170 600 100 S725 30 850 100 S975 170 1100 100";
const nodeY = [100, 100, 100, 100, 100];

export default function Approach() {
  const ref = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });

  return (
    <section id="approach" aria-labelledby="approach-title" className="grain section-pad relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(10,134,199,.07),transparent_60%)]"
      />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Our Approach</Eyebrow>
          <SplitHeading
            id="approach-title"
            text="From a question to a possibility."
            className="mt-6 font-serif text-5xl leading-[1.02] sm:text-6xl lg:text-7xl"
            gold={["possibility"]}
          />
        </div>

        {/* Desktop: animated wave timeline */}
        <div ref={ref} className="relative mt-20 hidden lg:block">
          <svg viewBox="0 0 1200 200" className="w-full overflow-visible" aria-hidden>
            <defs>
              <linearGradient id="ap-line" x1="0" x2="1">
                <stop offset="0" stopColor="#5FA9DA" />
                <stop offset="1" stopColor="#D6A84B" />
              </linearGradient>
              <filter id="ap-glow">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>
            <path d={wavePath} fill="none" stroke="rgba(20,41,74,.10)" strokeWidth="2" />
            <motion.path
              d={wavePath}
              fill="none"
              stroke="url(#ap-line)"
              strokeWidth="6"
              filter="url(#ap-glow)"
              opacity=".5"
              style={{ pathLength: reducedMotion ? 1 : progress }}
            />
            <motion.path
              d={wavePath}
              fill="none"
              stroke="url(#ap-line)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength: reducedMotion ? 1 : progress }}
            />
            {!reducedMotion &&
              [0, 1, 2, 3].map((i) => (
                <circle
                  key={i}
                  r={i % 2 ? 2 : 3}
                  fill={i % 2 ? "#5FA9DA" : "#C99B48"}
                  style={{ filter: "drop-shadow(0 0 4px rgba(185,138,53,.6))" }}
                >
                  <animateMotion dur="9s" begin={`${i * 2.25}s`} repeatCount="indefinite" path={wavePath} />
                </circle>
              ))}
            {steps.map((step, i) => (
              <g key={step.n} transform={`translate(${100 + i * 250} ${nodeY[i]})`}>
                <circle r="22" fill="#FFFFFF" stroke="#B98A35" strokeOpacity=".5" />
                <circle r="6" fill="#B98A35" className="anim-pulse" style={{ animationDelay: `${i * 0.6}s` }} />
              </g>
            ))}
          </svg>
          <div className="mt-6 grid grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="group text-center"
              >
                <p className="text-xs font-semibold tracking-[0.3em] text-gold">{step.n}</p>
                <h3 className="mt-3 font-serif text-3xl transition-colors group-hover:text-gold-light">{step.t}</h3>
                <p className="mx-auto mt-3 max-w-[15rem] text-sm leading-relaxed text-white/60">{step.d}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile / tablet: vertical timeline */}
        <ol className="relative mt-14 space-y-10 border-l border-white/10 pl-8 lg:hidden">
          <motion.span
            aria-hidden
            className="absolute -left-px top-0 w-px origin-top bg-gradient-to-b from-electric to-gold"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            style={{ height: "100%" }}
          />
          {steps.map((step, i) => (
            <motion.li
              key={step.n}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative"
            >
              <span
                aria-hidden
                className="absolute -left-[2.45rem] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-gold/60 bg-paper"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              </span>
              <p className="text-xs font-semibold tracking-[0.3em] text-gold">{step.n}</p>
              <h3 className="mt-1 font-serif text-3xl">{step.t}</h3>
              <p className="mt-2 text-sm text-white/65">{step.d}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
