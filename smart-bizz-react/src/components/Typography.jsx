import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const wordVariants = {
  hidden: { y: "110%", opacity: 0, rotate: 3 },
  show: {
    y: "0%",
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Heading whose words slide up one by one. Words listed in `gold` get the gold gradient. */
export function SplitHeading({ text, as = "h2", className = "", delay = 0, gold, id }) {
  const Tag = motion[as];
  const words = text.split(" ");

  return (
    <Tag
      id={id}
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.3em] -mb-[0.18em] align-bottom"
        >
          <motion.span
            variants={wordVariants}
            className={`inline-block ${gold?.includes(word.replace(/[.,]/g, "")) ? "gold-text" : ""}`}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function Eyebrow({ children, className = "" }) {
  return (
    <motion.p
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`eyebrow flex items-center gap-3 ${className}`}
    >
      <span className="h-px w-10 bg-gold/70" />
      {children}
    </motion.p>
  );
}

/** Shared fade-up variant; pass `custom={index}` to stagger. */
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};
