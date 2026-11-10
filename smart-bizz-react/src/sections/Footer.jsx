import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";
import ParticleField from "../components/ParticleField";
import { navItems, site } from "../config/site";
import { useInterest } from "../context/InterestContext";
import { Link } from "react-router-dom";
import { scrollToTop } from "../hooks/useActiveSection";

const footerServices = [
  ["Business Research & Intelligence", "Business Research"],
  ["Research & Development", "Research & Development"],
  ["Website & Digital Development", "Website Development"],
  ["Business Strategy & Planning", "Business Strategy"],
  ["Financial & Market Research", "Financial Research"],
  ["Startup & Venture Development", "Startup / New Venture"],
];

export default function Footer() {
  const ref = useRef(null);
  const { startConversation } = useInterest();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const footerY = useTransform(scrollYProgress, [0, 1], ["-18%", "0%"]);
  const footerOpacity = useTransform(scrollYProgress, [0, 0.6], [0.2, 1]);
  const year = new Date().getFullYear();
  const { email, phone, address, website } = site.contact;
  const hasContact = email || phone || address;

  return (
    <div ref={ref} className="relative overflow-hidden">
      <section
        aria-label="Our promise"
        className="relative border-t border-white/5 px-6 py-28 text-center sm:py-36"
      >
        <ParticleField mode="twinkle" colors={["#C99B48", "#7FB6DE"]} count={60} speed={0.3} size={[0.4, 1.4]} />
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="eyebrow relative"
        >
          Our promise
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 40, letterSpacing: "0.08em" }}
          whileInView={{ opacity: 1, y: 0, letterSpacing: "-0.01em" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-6 max-w-5xl font-serif text-4xl leading-tight sm:text-6xl"
        >
          We don't just follow possibilities.{" "}
          <span className="gold-text italic">We research them, develop them and build them.</span>
        </motion.h2>
      </section>

      <motion.footer
        style={{ y: footerY, opacity: footerOpacity }}
        className="relative border-t border-white/10 px-6 pb-10 pt-20 sm:px-10 lg:px-16"
      >
        <div aria-hidden className="hairline absolute inset-x-0 top-0" />
        <div className="container-x">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
            <div>
              <Link to="/" className="flex items-center gap-4">
                <img src={site.logo} alt={`${site.name} logo`} loading="lazy" className="h-14 w-14 object-contain" />
                <span className="font-serif text-2xl leading-tight">
                  Smart Bizz
                  <br />
                  <span className="text-gold">Research Hub</span>
                </span>
              </Link>
              <p className="mt-5 font-serif text-lg italic text-white/70">{site.tagline}</p>
              <p className="mt-4 max-w-xs text-sm text-white/50">
                Built on knowledge. Driven by innovation. Inspired by possibilities.
              </p>
            </div>

            <nav aria-label="Footer">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-gold">Navigate</h3>
              <ul className="mt-5 space-y-2.5 text-sm">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <Link to={item.path} className="text-white/65 transition-colors hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-gold">Services</h3>
              <ul className="mt-5 space-y-2.5 text-sm">
                {footerServices.map(([label, interest]) => (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => startConversation(interest)}
                      className="text-left text-white/65 transition-colors hover:text-white"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-gold">Contact</h3>
              <ul className="mt-5 space-y-2.5 text-sm text-white/65">
                {email && (
                  <li>
                    <a href={`mailto:${email}`} className="hover:text-white">
                      {email}
                    </a>
                  </li>
                )}
                {phone && (
                  <li>
                    <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="hover:text-white">
                      {phone}
                    </a>
                  </li>
                )}
                {address && <li>{address}</li>}
                {website && (
                  <li>
                    <a href={website} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      {website.replace(/^https?:\/\//, "")}
                    </a>
                  </li>
                )}
                {!hasContact && (
                  <li>
                    <Link to="/contact" className="hover:text-white">
                      Send us a message
                    </Link>
                  </li>
                )}
              </ul>
              {site.socials.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {site.socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/70 transition-colors hover:border-gold hover:text-gold-light"
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
            <p>© {year} Smart Bizz Research Hub. All rights reserved.</p>
            <button
              type="button"
              onClick={() => scrollToTop()}
              className="group flex items-center gap-2 uppercase tracking-[0.22em] hover:text-gold"
            >
              Back to top{" "}
              <ArrowUp
                className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5"
                aria-hidden
              />
            </button>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
