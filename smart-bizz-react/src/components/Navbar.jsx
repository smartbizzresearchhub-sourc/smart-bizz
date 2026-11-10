import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { navItems, site } from "../config/site";

export default function Navbar() {
  const { scrollY } = useScroll();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  // Close the mobile menu whenever the page changes.
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
      >
        <nav
          aria-label="Primary"
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6 ${
            scrolled
              ? "border border-white/10 bg-paper/80 shadow-[0_14px_40px_-22px_rgba(20,41,74,.35)] backdrop-blur-xl"
              : "border border-transparent bg-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-3" aria-label={`${site.name} — home`}>
            <img src={site.logo} alt="" className="h-9 w-9 object-contain" />
            <span className="hidden whitespace-nowrap font-serif text-lg leading-none tracking-wide sm:block xl:hidden 2xl:block">
              Smart Bizz <span className="text-gold">Research Hub</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 xl:flex">
            {navItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `relative whitespace-nowrap rounded-full px-3 py-2 text-[0.7rem] font-medium uppercase tracking-[0.14em] transition-colors ${
                      isActive ? "text-gold-light" : "text-white/70 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-white/[0.07]"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden whitespace-nowrap rounded-full border border-gold/60 bg-blush px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold-light transition-all duration-300 hover:bg-gold hover:text-paper md:inline-block"
            >
              Let's Collaborate
            </Link>
            <button
              type="button"
              className="relative z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-paper/80 xl:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="relative block h-3.5 w-5">
                <motion.span
                  className="absolute left-0 top-0 h-px w-5 bg-white"
                  animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                />
                <motion.span
                  className="absolute left-0 top-[7px] h-px w-3.5 bg-gold"
                  animate={menuOpen ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }}
                />
                <motion.span
                  className="absolute left-0 top-[14px] h-px w-5 bg-white"
                  animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[55] flex flex-col justify-center overflow-y-auto bg-navy-950/95 px-8 backdrop-blur-xl xl:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 44px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(10,134,199,.10),transparent_50%),radial-gradient(circle_at_10%_90%,rgba(185,138,53,.12),transparent_50%)]" />
            <ul className="relative space-y-1">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06 }}
                >
                  <NavLink
                    to={item.path}
                    end
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-baseline gap-4 py-2 font-serif text-4xl sm:text-5xl"
                  >
                    {({ isActive }) => (
                      <>
                        <span className="font-sans text-xs tracking-widest text-gold/70">0{i + 1}</span>
                        <span
                          className={`transition-colors ${
                            isActive ? "text-gold-light" : "text-white group-hover:text-gold-light"
                          }`}
                        >
                          {item.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="relative mt-10"
            >
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="inline-flex w-fit rounded-full bg-gold px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-paper"
              >
                Let's Collaborate
              </Link>
            </motion.div>
            <p className="relative mt-10 font-serif italic text-white/50">{site.tagline}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
