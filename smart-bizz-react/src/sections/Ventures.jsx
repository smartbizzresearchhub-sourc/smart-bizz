import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Compass, Lightbulb, Sparkles, Sprout } from "lucide-react";
import { Eyebrow, SplitHeading } from "../components/Typography";

const ventures = [
  {
    title: "New Venture Exploration",
    tag: "Future initiative",
    Icon: Compass,
    text: "Investigating sectors and gaps where a new, independent venture could create lasting value.",
  },
  {
    title: "Independent Business Ideas",
    tag: "Concept stage",
    Icon: Lightbulb,
    text: "Developing original business concepts of our own and testing them against research before committing.",
  },
  {
    title: "Innovation Projects",
    tag: "Future initiative",
    Icon: Sparkles,
    text: "Exploratory projects in products, processes and digital tools that may grow into new offerings.",
  },
  {
    title: "Entrepreneurial Initiatives",
    tag: "Future initiative",
    Icon: Sprout,
    text: "Building the ground for programmes that support founders and nurture sustainable enterprises.",
  },
];

function VentureCard({ venture, index }) {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 150, damping: 15 });
  const rotateY = useSpring(tiltY, { stiffness: 150, damping: 15 });
  const glowLeft = useTransform(rotateY, [-8, 8], ["0%", "100%"]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 50, rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const rect = e.currentTarget.getBoundingClientRect();
        tiltY.set(((e.clientX - rect.left) / rect.width - 0.5) * 16);
        tiltX.set(-((e.clientY - rect.top) / rect.height - 0.5) * 12);
      }}
      onPointerLeave={() => {
        tiltX.set(0);
        tiltY.set(0);
      }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-paper via-paper to-ocean/40 p-8 shadow-[0_20px_50px_-35px_rgba(20,41,74,.35)]"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-1/2 h-full w-1/2 rounded-full bg-blush blur-3xl transition-opacity duration-500 group-hover:opacity-100 md:opacity-0"
        style={{ left: glowLeft }}
      />
      <div className="relative flex items-center justify-between">
        <venture.Icon aria-hidden className="h-7 w-7 text-gold" strokeWidth={1.3} />
        <span className="rounded-full border border-gold/40 bg-blush px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-gold-light">
          {venture.tag}
        </span>
      </div>
      <h3 className="relative mt-auto pt-16 font-serif text-3xl leading-tight">{venture.title}</h3>
      <p className="relative mt-3 text-sm leading-relaxed text-white/65">{venture.text}</p>
    </motion.article>
  );
}

export default function Ventures() {
  return (
    <section id="ventures" aria-labelledby="ventures-title" className="grain section-pad relative overflow-hidden">
      <div aria-hidden className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-ocean/60 blur-[140px]" />
      <div className="container-x relative">
        <Eyebrow>Future Ventures</Eyebrow>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <SplitHeading
            id="ventures-title"
            text="Not just supporting businesses. Building possibilities."
            className="font-serif text-5xl leading-[1.02] sm:text-6xl"
            gold={["Building", "possibilities"]}
          />
          <p className="text-white/70">
            Our ambition extends beyond providing research and development services. We aspire to
            explore independent business concepts, develop new ventures and create opportunities that
            can evolve into sustainable enterprises.
          </p>
        </div>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ventures.map((venture, i) => (
            <VentureCard key={venture.title} venture={venture} index={i} />
          ))}
        </div>
        <p className="mt-8 text-xs uppercase tracking-[0.22em] text-white/40">
          These are future initiatives and concepts, not existing businesses.
        </p>
      </div>
    </section>
  );
}
