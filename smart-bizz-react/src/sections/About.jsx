import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ParticleField from "../components/ParticleField";
import { Eyebrow, SplitHeading, fadeUp } from "../components/Typography";

const principles = [
  {
    n: "01",
    title: "Research Before Decisions.",
    text: "Every recommendation starts with evidence — understanding the market, the numbers and the context before committing to a direction.",
  },
  {
    n: "02",
    title: "Innovation Through Exploration.",
    text: "We test ideas, question assumptions and explore alternatives, because better solutions are usually found, not assumed.",
  },
  {
    n: "03",
    title: "Growth Through Execution.",
    text: "Insight only matters when it becomes action — so we carry research through to practical, workable outcomes.",
  },
];

const paragraphs = [
  "Smart Bizz Research Hub is an independent business research, development and innovation initiative established to explore opportunities, develop ideas and support businesses in their journey from concept to execution.",
  "We bring together research, analytical thinking, technology, creativity and strategic planning to help businesses make informed decisions and explore new possibilities.",
];

export default function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const quoteY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      id="about"
      ref={ref}
      aria-labelledby="about-title"
      className="grain section-pad relative overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_10%,rgba(207,226,244,.9),transparent_55%)]"
      />
      <ParticleField mode="float" colors={["#C99B48", "#7FB6DE"]} count={28} speed={0.35} size={[0.5, 1.6]} />

      <div className="container-x relative">
        <Eyebrow>About Us</Eyebrow>
        <div className="mt-8 grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <SplitHeading
              id="about-title"
              text="Beyond business. Into possibilities."
              className="font-serif text-5xl leading-[1.02] sm:text-6xl lg:text-7xl"
              gold={["Into", "possibilities"]}
            />
            <motion.div style={{ y: quoteY }} className="mt-12 hidden border-l border-gold/50 pl-6 lg:block">
              <p className="font-serif text-2xl italic leading-snug text-white/85">
                “We believe every successful business begins with an idea, grows through research,
                transforms through innovation and reaches its potential through strategic execution.”
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.28em] text-gold/80">Our philosophy</p>
            </motion.div>
          </div>

          <div className="space-y-6 text-[1.02rem] leading-relaxed text-white/75">
            {paragraphs.map((text, i) => (
              <motion.p
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.5 }}
              >
                {text}
              </motion.p>
            ))}
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="font-serif text-2xl leading-snug text-white"
            >
              Our approach is built on one simple belief:{" "}
              <span className="gold-text italic">
                every successful venture deserves a strong foundation of knowledge.
              </span>
            </motion.p>
          </div>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-3">
          {principles.map((item, i) => (
            <motion.article
              key={item.n}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="group relative overflow-hidden bg-paper p-8 sm:p-10"
            >
              <div
                aria-hidden
                className="absolute inset-0 translate-y-full bg-gradient-to-t from-ocean/70 to-transparent transition-transform duration-700 ease-out group-hover:translate-y-0"
              />
              <span className="relative font-serif text-6xl text-gold/30 transition-colors duration-500 group-hover:text-gold/70">
                {item.n}
              </span>
              <h3 className="relative mt-6 font-serif text-2xl">{item.title}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-white/65">{item.text}</p>
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-700 group-hover:w-full"
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
