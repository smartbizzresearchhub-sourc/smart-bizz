import { Suspense, lazy, useEffect } from "react";
import { Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { InterestProvider } from "./context/InterestContext";
import OceanBackground from "./components/OceanBackground";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Services from "./sections/Services";
import Approach from "./sections/Approach";
import VisionMission from "./sections/VisionMission";
import Ventures from "./sections/Ventures";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

// The admin page is downloaded only when someone visits /admin.
const AdminApp = lazy(() => import("./admin/AdminApp"));

const SITE_TITLE = "Smart Bizz Research Hub";

/** "← Back to home" link shown at the top of inner pages. */
function BackToHome() {
  return (
    <div className="relative z-10 px-6 pt-28 -mb-16 sm:px-10 md:-mb-24 lg:px-16">
      <div className="container-x">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-paper/70 px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur-md transition-colors hover:border-gold hover:text-gold-dark"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden />
          Back to home
        </Link>
      </div>
    </div>
  );
}

/** Sets the browser-tab title and starts each page at the top. */
function Page({ title, back = false, children }) {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_TITLE}` : `${SITE_TITLE} — Five Elements. One Vision. Infinite Possibilities.`;
    window.scrollTo(0, 0);
  }, [title, pathname]);
  return (
    <>
      {back && <BackToHome />}
      {children}
    </>
  );
}

/** Shared frame for every public page: background, progress bar, navbar, footer. */
function SiteLayout() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <MotionConfig reducedMotion="user">
      <InterestProvider>
        <OceanBackground />
        <a
          href="#main"
          className="sr-only z-[100] rounded bg-gold px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        {/* Scroll progress bar */}
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-electric via-gold to-gold-light"
          style={{ scaleX: progress }}
        />
        <Navbar />
        <main id="main">
          <Outlet />
        </main>
        <Footer />
      </InterestProvider>
    </MotionConfig>
  );
}

function NotFound() {
  return (
    <section className="section-pad flex min-h-[80vh] flex-col items-center justify-center text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 font-serif text-5xl sm:text-6xl">
        This page <span className="gold-text italic">doesn't exist.</span>
      </h1>
      <Link
        to="/"
        className="mt-10 rounded-full bg-gold px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-paper"
      >
        Back to home
      </Link>
    </section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route
          index
          element={
            <Page>
              <Hero />
              <About />
              <Services />
              <Approach />
              <VisionMission />
              <Ventures />
              <Contact />
            </Page>
          }
        />
        <Route path="about" element={<Page title="About Us" back><About /></Page>} />
        <Route path="services" element={<Page title="What We Do" back><Services /></Page>} />
        <Route path="approach" element={<Page title="Our Approach" back><Approach /></Page>} />
        <Route path="vision" element={<Page title="Vision & Mission" back><VisionMission /></Page>} />
        <Route path="contact" element={<Page title="Contact" back><Contact /></Page>} />
        <Route path="*" element={<Page title="Page not found"><NotFound /></Page>} />
      </Route>
      <Route
        path="admin"
        element={
          <Suspense fallback={null}>
            <AdminApp />
          </Suspense>
        }
      />
    </Routes>
  );
}
