import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] transition-[box-shadow,background-color,color,border-color] duration-500 disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  gold: "bg-gradient-to-r from-gold-dark via-gold to-[#C99B48] text-paper shadow-[0_12px_32px_-14px_rgba(148,102,31,.6)] hover:shadow-[0_16px_40px_-12px_rgba(148,102,31,.7)]",
  ghost:
    "border border-white/20 bg-paper/70 text-white backdrop-blur-md hover:border-gold hover:text-gold-dark",
};

export default function MagneticButton({
  children,
  onClick,
  href,
  variant = "gold",
  type = "button",
  disabled,
  className = "",
  icon = true,
  ariaLabel,
}) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18 });
  const y = useSpring(my, { stiffness: 220, damping: 18 });

  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 10);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 8);
  };
  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const content = (
    <>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-paper/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      <span className="relative">{children}</span>
      {icon && (
        <ArrowRight
          aria-hidden
          className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </>
  );

  const shared = {
    onPointerMove,
    onPointerLeave,
    style: { x, y },
    whileTap: { scale: 0.97 },
    className: `${base} ${variants[variant] ?? variants.ghost} ${className}`,
    "aria-label": ariaLabel,
  };

  return href ? (
    <motion.a ref={ref} href={href} {...shared}>
      {content}
    </motion.a>
  ) : (
    <motion.button ref={ref} type={type} onClick={onClick} disabled={disabled} {...shared}>
      {content}
    </motion.button>
  );
}
