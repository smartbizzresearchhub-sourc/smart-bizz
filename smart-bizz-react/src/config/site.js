import defaultLogo from "../assets/logo.webp";

// Values from window.SMARTBIZZ_CONFIG (index.html) win over VITE_* env variables.
const runtime = (typeof window !== "undefined" && window.SMARTBIZZ_CONFIG) || {};
const env = import.meta.env;

const pick = (...values) => {
  for (const v of values) if (typeof v === "string" && v.trim()) return v.trim();
  return "";
};

export const site = {
  name: "Smart Bizz Research Hub",
  shortName: "Smart Bizz",
  tagline: "Five Elements. One Vision. Infinite Possibilities.",
  logo: pick(runtime.logo) || defaultLogo,
  contact: {
    email: pick(runtime.email, env.VITE_CONTACT_EMAIL),
    phone: pick(runtime.phone, env.VITE_CONTACT_PHONE),
    address: pick(runtime.address, env.VITE_CONTACT_ADDRESS),
    website: pick(runtime.website, env.VITE_WEBSITE_URL),
  },
  form: {
    endpoint: pick(runtime.formEndpoint, env.VITE_FORM_ENDPOINT),
    accessKey: pick(runtime.formAccessKey, env.VITE_FORM_ACCESS_KEY),
  },
  socials: [
    { label: "LinkedIn", href: pick(runtime.socials?.linkedin, env.VITE_SOCIAL_LINKEDIN) },
    { label: "Instagram", href: pick(runtime.socials?.instagram, env.VITE_SOCIAL_INSTAGRAM) },
    { label: "Facebook", href: pick(runtime.socials?.facebook, env.VITE_SOCIAL_FACEBOOK) },
    { label: "X", href: pick(runtime.socials?.x, env.VITE_SOCIAL_X) },
    { label: "YouTube", href: pick(runtime.socials?.youtube, env.VITE_SOCIAL_YOUTUBE) },
  ].filter((s) => s.href.length > 0),
};

// Each menu item is its own page.
export const navItems = [
  { id: "home", label: "Home", path: "/" },
  { id: "about", label: "About", path: "/about" },
  { id: "services", label: "What We Do", path: "/services" },
  { id: "approach", label: "Our Approach", path: "/approach" },
  { id: "vision", label: "Vision & Mission", path: "/vision" },
  { id: "contact", label: "Contact", path: "/contact" },
];

export const interestOptions = [
  "Business Research",
  "Research & Development",
  "Website Development",
  "Business Strategy",
  "Financial Research",
  "Startup / New Venture",
  "Other",
];
