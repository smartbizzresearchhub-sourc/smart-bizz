import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  ArrowUpRight,
  ChartLine,
  Compass,
  FlaskConical,
  MonitorSmartphone,
  Rocket,
  ScanSearch,
} from "lucide-react";
import { Eyebrow, SplitHeading, fadeUp } from "../components/Typography";
import { useInterest } from "../context/InterestContext";

const services = [
  {
    n: "01",
    title: "Business Research & Intelligence",
    Icon: ScanSearch,
    interest: "Business Research",
    text: "Structured investigation of markets, industries and competitors — turning scattered information into clear, decision-ready insight.",
  },
  {
    n: "02",
    title: "Research & Development",
    Icon: FlaskConical,
    interest: "Research & Development",
    text: "Exploring, validating and refining concepts, products and processes before they are built, so ideas mature on solid ground.",
  },
  {
    n: "03",
    title: "Website & Digital Development",
    Icon: MonitorSmartphone,
    interest: "Website Development",
    text: "Websites, landing pages and digital presence designed to communicate clearly and grow with the business behind them.",
  },
  {
    n: "04",
    title: "Business Strategy & Planning",
    Icon: Compass,
    interest: "Business Strategy",
    text: "Feasibility studies, business models and structured plans that connect where a business is to where it intends to go.",
  },
  {
    n: "05",
    title: "Financial & Market Research",
    Icon: ChartLine,
    interest: "Financial Research",
    text: "Financial and market analysis that clarifies viability, opportunity size and the numbers behind a decision.",
  },
  {
    n: "06",
    title: "Startup & Venture Development",
    Icon: Rocket,
    interest: "Startup / New Venture",
    text: "Support for new ventures from first idea through research, validation and planning towards a sustainable launch.",
  },
];

function ServiceCard({ service, index }) {
  const { startConversation } = useInterest();
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, rgba(185,138,53,.10), transparent 70%)`;

  return (
    <motion.article
      custom={index % 3}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }}
      onPointerLeave={() => {
        mouseX.set(-200);
        mouseY.set(-200);
      }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-paper p-8 shadow-[0_20px_50px_-35px_rgba(20,41,74,.35)] transition-[border-color,transform] duration-500 hover:-translate-y-1.5 hover:border-gold/40 sm:p-9"
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />
      <div className="relative flex items-start justify-between">
        <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-blush text-gold transition-all duration-500 group-hover:rotate-[-6deg] group-hover:border-gold group-hover:shadow-[0_8px_24px_-8px_rgba(185,138,53,.6)]">
          <service.Icon
            className="h-6 w-6 transition-transform duration-500 group-hover:scale-110"
            strokeWidth={1.4}
            aria-hidden
          />
        </span>
        <span className="font-serif text-4xl text-white/15 transition-colors duration-500 group-hover:text-gold/40">
          {service.n}
        </span>
      </div>
      <h3 className="relative mt-8 font-serif text-[1.65rem] leading-tight">{service.title}</h3>
      <p className="relative mt-3 flex-1 text-sm leading-relaxed text-white/65">{service.text}</p>
      <button
        type="button"
        onClick={() => startConversation(service.interest)}
        className="relative mt-7 inline-flex w-fit items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold-light"
        aria-label={`Explore more about ${service.title}`}
      >
        <span className="relative">
          Explore more
          <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
        </span>
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </button>
    </motion.article>
  );
}

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-pad relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-ocean/40 blur-[120px]"
      />
      <div className="container-x relative">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>What We Do</Eyebrow>
            <SplitHeading
              id="services-title"
              text="Ideas are only the beginning."
              className="mt-6 max-w-3xl font-serif text-5xl leading-[1.02] sm:text-6xl lg:text-7xl"
              gold={["beginning"]}
            />
          </div>
          <p className="max-w-sm text-white/65">
            Six connected service verticals — each one a step in carrying an idea from first question
            to working reality.
          </p>
        </div>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={service.n} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
