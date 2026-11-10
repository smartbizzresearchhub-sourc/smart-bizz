import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, CircleCheck, LoaderCircle, Mail, Phone } from "lucide-react";
import ParticleField from "../components/ParticleField";
import MagneticButton from "../components/MagneticButton";
import { Eyebrow, SplitHeading } from "../components/Typography";
import { interestOptions, site } from "../config/site";
import { useInterest } from "../context/InterestContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;

const emptyForm = { name: "", email: "", phone: "", organisation: "", message: "" };

function validate(values, interest) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your full name.";
  if (!EMAIL_RE.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (!PHONE_RE.test(values.phone.trim()) || values.phone.replace(/\D/g, "").length < 7)
    errors.phone = "Please enter a valid contact number.";
  if (!interest) errors.interest = "Please choose an area of interest.";
  if (values.message.trim().length < 20)
    errors.message = "Please describe your project in at least 20 characters.";
  return errors;
}

const inputClass = (error) =>
  `peer w-full rounded-2xl border bg-paper px-5 pb-3 pt-6 text-[0.95rem] text-white outline-none transition-all duration-300 placeholder:text-transparent focus:bg-paper ${
    error
      ? "border-red-500/70"
      : "border-white/12 hover:border-white/25 focus:border-gold/80 focus:shadow-[0_0_0_4px_rgba(185,138,53,.14)]"
  }`;

const labelClass =
  "pointer-events-none absolute left-5 top-4 origin-left text-sm text-white/50 transition-all duration-300 peer-focus:top-2 peer-focus:text-[0.65rem] peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-gold peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[0.65rem] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.18em]";

/** Wraps an input with a floating label and animated error message. */
function Field({ id, label, error, children }) {
  return (
    <div className="relative">
      {children}
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-err`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 pl-2 text-xs text-red-600"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const { interest, setInterest } = useInterest();
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [feedback, setFeedback] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const update = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const mailtoLink = () => {
    if (!site.contact.email) return "";
    const body = `Name: ${values.name}
Email: ${values.email}
Phone: ${values.phone}
Organisation: ${values.organisation || "-"}
Area of interest: ${interest}

${values.message}`;
    return `mailto:${site.contact.email}?subject=${encodeURIComponent(
      `Enquiry — ${interest || "Smart Bizz Research Hub"}`,
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    const found = validate(values, interest);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`cf-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    if (honeypot) return; // bot

    setStatus("sending");
    setFeedback("");
    try {
      const enquiry = {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        organisation: values.organisation.trim(),
        interest,
        message: values.message.trim(),
        source: "Smart Bizz Research Hub website",
      };

      // 1. Save to Firebase (Firestore) — this is what the /admin page reads.
      const { saveEnquiry } = await import("../lib/enquiries");
      await saveEnquiry(enquiry);

      // 2. Optional: also forward to an email service (Formspree / Web3Forms) if configured.
      if (site.form.endpoint) {
        const payload = {
          ...enquiry,
          subject: `New enquiry — ${interest}`,
          _subject: `New enquiry — ${interest}`,
        };
        if (site.form.accessKey) payload.access_key = site.form.accessKey;
        fetch(site.form.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        }).catch((err) => console.warn("[Smart Bizz] Email forwarding failed:", err));
      }

      setStatus("success");
      setFeedback("Thank you — your message has been received. We will be in touch soon.");
      setValues(emptyForm);
      setInterest("");
    } catch (err) {
      setStatus("error");
      const timedOut = err?.name === "TimeoutError";
      setFeedback(
        timedOut
          ? "The request timed out. Please check your connection and try again."
          : "We could not send your message. Please check your connection and try again.",
      );
      console.error("[Smart Bizz] Form submission failed:", err);
    }
  };

  const sending = status === "sending";

  return (
    <section id="contact" aria-labelledby="contact-title" className="grain section-pad relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(207,226,244,.9),transparent_55%),radial-gradient(ellipse_at_90%_90%,rgba(247,238,221,.9),transparent_50%)]"
      />
      <ParticleField mode="float" colors={["#C99B48", "#7FB6DE"]} count={30} speed={0.35} size={[0.5, 1.6]} />

      <div className="container-x relative grid gap-16 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <Eyebrow>Let's Collaborate</Eyebrow>
          <SplitHeading
            id="contact-title"
            text="Every great journey starts with a conversation."
            className="mt-6 font-serif text-5xl leading-[1.02] sm:text-6xl"
            gold={["conversation"]}
          />
          <p className="mt-8 max-w-md text-lg leading-relaxed text-white/70">
            Have an idea, a challenge or an opportunity worth exploring? Let's research it, develop it
            and discover what it can become.
          </p>
          {(site.contact.email || site.contact.phone) && (
            <ul className="mt-10 space-y-4">
              {site.contact.email && (
                <li>
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="group inline-flex items-center gap-4 text-white/80 hover:text-gold-light"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 group-hover:border-gold">
                      <Mail className="h-4 w-4" aria-hidden />
                    </span>
                    {site.contact.email}
                  </a>
                </li>
              )}
              {site.contact.phone && (
                <li>
                  <a
                    href={`tel:${site.contact.phone.replace(/[^\d+]/g, "")}`}
                    className="group inline-flex items-center gap-4 text-white/80 hover:text-gold-light"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 group-hover:border-gold">
                      <Phone className="h-4 w-4" aria-hidden />
                    </span>
                    {site.contact.phone}
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>

        <motion.form
          noValidate
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative rounded-[2rem] p-6 sm:p-10"
          aria-busy={sending}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="cf-name" label="Full name *" error={errors.name}>
              <input
                id="cf-name"
                name="name"
                autoComplete="name"
                placeholder="Full name"
                value={values.name}
                onChange={update("name")}
                className={inputClass(errors.name)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "cf-name-err" : undefined}
              />
            </Field>
            <Field id="cf-email" label="Email address *" error={errors.email}>
              <input
                id="cf-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                value={values.email}
                onChange={update("email")}
                className={inputClass(errors.email)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "cf-email-err" : undefined}
              />
            </Field>
            <Field id="cf-phone" label="Contact number *" error={errors.phone}>
              <input
                id="cf-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Phone"
                value={values.phone}
                onChange={update("phone")}
                className={inputClass(errors.phone)}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "cf-phone-err" : undefined}
              />
            </Field>
            <Field id="cf-organisation" label="Organisation (optional)">
              <input
                id="cf-organisation"
                name="organisation"
                autoComplete="organization"
                placeholder="Organisation"
                value={values.organisation}
                onChange={update("organisation")}
                className={inputClass()}
              />
            </Field>

            <div className="relative sm:col-span-2">
              <label
                htmlFor="cf-interest"
                className="mb-2 block pl-2 text-[0.65rem] uppercase tracking-[0.18em] text-white/50"
              >
                Area of interest *
              </label>
              <select
                id="cf-interest"
                name="interest"
                value={interest}
                onChange={(e) => {
                  setInterest(e.target.value);
                  setErrors((err) => ({ ...err, interest: undefined }));
                }}
                className={`w-full appearance-none rounded-2xl border bg-paper px-5 py-4 text-[0.95rem] text-white outline-none transition-all focus:border-gold/80 ${
                  errors.interest ? "border-red-500/70" : "border-white/12 hover:border-white/25"
                }`}
                aria-invalid={!!errors.interest}
                aria-describedby={errors.interest ? "cf-interest-err" : undefined}
              >
                <option value="" disabled>
                  Select an area…
                </option>
                {interestOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span aria-hidden className="pointer-events-none absolute right-5 top-[3.05rem] text-gold">
                ▾
              </span>
              {errors.interest && (
                <p id="cf-interest-err" role="alert" className="mt-1.5 pl-2 text-xs text-red-600">
                  {errors.interest}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <Field id="cf-message" label="Project description *" error={errors.message}>
                <textarea
                  id="cf-message"
                  name="message"
                  rows={5}
                  placeholder="Project description"
                  value={values.message}
                  onChange={update("message")}
                  className={`${inputClass(errors.message)} resize-y`}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "cf-message-err" : undefined}
                />
              </Field>
            </div>

            {/* Honeypot field for bots */}
            <input
              type="text"
              name="website_url"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />
          </div>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/40">* Required fields</p>
            <MagneticButton type="submit" disabled={sending} icon={!sending}>
              {sending ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> Sending…
                </span>
              ) : (
                "Start a conversation"
              )}
            </MagneticButton>
          </div>

          <div aria-live="polite" className="min-h-0">
            <AnimatePresence>
              {(status === "success" || status === "error") && feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-6 flex items-start gap-3 rounded-2xl border p-4 text-sm ${
                    status === "success"
                      ? "border-emerald-500/40 bg-emerald-50 text-emerald-800"
                      : "border-red-400/40 bg-red-50 text-red-800"
                  }`}
                >
                  {status === "success" ? (
                    <CircleCheck className="mt-0.5 h-5 w-5 flex-none" aria-hidden />
                  ) : (
                    <CircleAlert className="mt-0.5 h-5 w-5 flex-none" aria-hidden />
                  )}
                  <div>
                    <p>{feedback}</p>
                    {status === "error" && site.contact.email && (
                      <a
                        href={mailtoLink()}
                        className="mt-2 inline-block font-semibold text-gold-dark underline underline-offset-4"
                      >
                        Email {site.contact.email}
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
