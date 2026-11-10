import { motion } from "framer-motion";
import { Eye, Target } from "lucide-react";

const items = [
  {
    key: "vision",
    label: "Our Vision",
    Icon: Eye,
    from: -40,
    tint: "rgba(232,206,150,.35)",
    color: "text-gold",
    text: "To become a dynamic ecosystem for business research, innovation and venture development, enabling ideas to evolve into meaningful and sustainable enterprises.",
  },
  {
    key: "mission",
    label: "Our Mission",
    Icon: Target,
    from: 40,
    tint: "rgba(160,205,235,.40)",
    color: "text-electric",
    text: "To provide structured research, analytical insights, creative development and technology-driven solutions that empower individuals and businesses to explore opportunities, make informed decisions and build with confidence.",
  },
];

export default function VisionMission() {
  return (
    <section id="vision" aria-label="Our vision and mission" className="relative grid overflow-hidden md:grid-cols-2">
      {items.map((item, i) => (
        <motion.article
          key={item.key}
          initial={{ opacity: 0, x: item.from }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className={`group relative flex min-h-[70vh] flex-col justify-center overflow-hidden px-8 py-24 sm:px-14 lg:px-20 ${
            i === 0 ? "md:border-r md:border-white/10" : ""
          }`}
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-70 transition-opacity duration-700 group-hover:opacity-100"
            style={{
              background: `radial-gradient(ellipse at ${i === 0 ? "20% 30%" : "80% 70%"}, ${item.tint}, transparent 65%)`,
            }}
          />
          <div
            aria-hidden
            className="anim-spin-slow absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/[0.06]"
          />
          <item.Icon aria-hidden className={`relative h-8 w-8 ${item.color}`} strokeWidth={1.2} />
          <h2 className={`relative mt-6 text-xs font-semibold uppercase tracking-[0.32em] ${item.color} font-sans`}>
            {item.label}
          </h2>
          <p className="relative mt-6 max-w-xl font-serif text-3xl leading-snug sm:text-4xl">“{item.text}”</p>
          <span
            aria-hidden
            className={`relative mt-10 block h-px w-16 transition-all duration-700 group-hover:w-40 ${
              i === 0 ? "bg-gold" : "bg-electric"
            }`}
          />
        </motion.article>
      ))}
      <motion.div
        aria-hidden
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4 }}
        className="absolute left-1/2 top-0 hidden h-full w-px origin-top bg-gradient-to-b from-transparent via-gold/40 to-transparent md:block"
      />
    </section>
  );
}
