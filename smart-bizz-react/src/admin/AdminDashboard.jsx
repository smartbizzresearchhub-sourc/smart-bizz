import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CircleAlert,
  ExternalLink,
  Files,
  Inbox,
  LogOut,
  Mail,
  Phone,
  Search,
  Trash2,
} from "lucide-react";
import { app } from "../firebase";
import { site } from "../config/site";
import { deleteEnquiry, setEnquiryStatus, watchEnquiries } from "../lib/enquiries";
import AdminFiles from "./AdminFiles";

const ADMIN_UID = "g3g2aoFniFW0vHYM6Qs7Kci6CJ32";

function describeEnquiryLoadError(error, uid) {
  const projectId = app.options.projectId || "not configured";
  if (error?.code === "permission-denied") {
    return `Firestore denied access (permission-denied). Signed-in UID: ${uid}. Rules allow UID: ${ADMIN_UID}. Website Firebase project: ${projectId}. Confirm the published rules in this exact project include this UID and allow reads on /enquiries/{id}.`;
  }
  return `Could not load enquiries (${error?.code || "unknown error"}). Website Firebase project: ${projectId}. Check the browser connection and Firebase Console.`;
}

const STATUSES = {
  new: { label: "New", badge: "border-electric/40 bg-electric/10 text-electric" },
  read: { label: "Read", badge: "border-white/20 bg-white/5 text-white/70" },
  replied: { label: "Replied", badge: "border-emerald-500/40 bg-emerald-50 text-emerald-800" },
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "read", label: "Read" },
  { id: "replied", label: "Replied" },
];

const formatDate = (ts, withTime = true) => {
  const date = ts?.toDate?.();
  if (!date) return "Just now";
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
};

function StatusBadge({ status }) {
  const s = STATUSES[status] ?? STATUSES.new;
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] ${s.badge}`}>
      {s.label}
    </span>
  );
}

export default function AdminDashboard({ user, onLogout }) {
  const [enquiries, setEnquiries] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("enquiries");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(
    () => {
      setEnquiries(null);
      setError("");
      return watchEnquiries(setEnquiries, (err) => {
        console.error(err);
        setError(describeEnquiryLoadError(err, user.uid));
        setEnquiries(null);
      });
    },
    [reloadCount, user.uid],
  );

  const counts = useMemo(() => {
    const c = { all: 0, new: 0, read: 0, replied: 0 };
    (enquiries ?? []).forEach((e) => {
      c.all++;
      c[e.status in c ? e.status : "new"]++;
    });
    return c;
  }, [enquiries]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (enquiries ?? []).filter((e) => {
      if (filter !== "all" && (e.status ?? "new") !== filter) return false;
      if (!term) return true;
      return [e.name, e.email, e.phone, e.organisation, e.interest, e.message]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(term));
    });
  }, [enquiries, filter, search]);

  const selected = enquiries?.find((e) => e.id === selectedId) ?? null;

  // Opening a new enquiry marks it as read.
  const open = (enquiry) => {
    setSelectedId(enquiry.id);
    if ((enquiry.status ?? "new") === "new") setEnquiryStatus(enquiry.id, "read").catch(console.error);
  };

  const changeStatus = (status) => {
    if (!selected) return;
    setEnquiryStatus(selected.id, status).catch(() => setError("Could not update the status."));
  };

  const remove = async () => {
    if (!selected) return;
    if (!window.confirm(`Delete the enquiry from ${selected.name}? This cannot be undone.`)) return;
    try {
      await deleteEnquiry(selected.id);
      setSelectedId(null);
    } catch {
      setError("Could not delete the enquiry.");
    }
  };

  const replyLink = selected
    ? `mailto:${selected.email}?subject=${encodeURIComponent(
        `Re: Your enquiry — ${selected.interest || site.name}`,
      )}&body=${encodeURIComponent(`Hi ${selected.name},\n\nThank you for contacting ${site.name}.\n\n`)}`
    : "";

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F4FBFE_0%,#E3F4FB_40%,#D0EBF7_100%)]">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="/" className="flex items-center gap-3" title="Open website">
            <img src={site.logo} alt="" className="h-9 w-9 object-contain" />
            <span className="hidden font-serif text-lg leading-none sm:block">
              Smart Bizz <span className="text-gold">Admin</span>
            </span>
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-[16rem] truncate text-xs text-white/50 sm:block">{user.email}</span>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:border-gold hover:text-gold-dark"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl">
          {activeTab === "enquiries" ? "Enquiries" : "Private files"}
        </h1>
        <nav className="mt-6 flex gap-2" aria-label="Admin sections">
          <button
            type="button"
            onClick={() => setActiveTab("enquiries")}
            aria-current={activeTab === "enquiries" ? "page" : undefined}
            className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${
              activeTab === "enquiries" ? "border-gold bg-blush" : "border-white/15 bg-paper hover:border-gold/40"
            }`}
          >
            <Inbox className="h-3.5 w-3.5" aria-hidden /> Enquiries
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("files")}
            aria-current={activeTab === "files" ? "page" : undefined}
            className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${
              activeTab === "files" ? "border-gold bg-blush" : "border-white/15 bg-paper hover:border-gold/40"
            }`}
          >
            <Files className="h-3.5 w-3.5" aria-hidden /> Private files
          </button>
        </nav>

        {activeTab === "files" ? (
          <AdminFiles user={user} />
        ) : (
          <>
        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-2xl border p-4 text-left transition-colors ${
                filter === f.id ? "border-gold bg-blush" : "border-white/10 bg-paper hover:border-gold/40"
              }`}
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/50">{f.label}</p>
              <p className="mt-1 font-serif text-3xl">{enquiries ? counts[f.id] : "–"}</p>
            </button>
          ))}
        </div>

        {error && (
          <div role="alert" className="mt-6 rounded-2xl border border-red-400/40 bg-red-50 p-4 text-sm text-red-800">
            <p className="flex items-start gap-2">
              <CircleAlert className="mt-0.5 h-4 w-4 flex-none" aria-hidden />
              <span className="break-words">{error}</span>
            </p>
            {enquiries === null && (
              <button
                type="button"
                onClick={() => setReloadCount((count) => count + 1)}
                className="ml-6 mt-3 rounded-full border border-red-800/30 px-4 py-1.5 text-xs font-semibold hover:bg-red-100"
              >
                Retry
              </button>
            )}
          </div>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          {/* List */}
          <section className={`${selected ? "hidden lg:block" : ""}`} aria-label="Enquiry list">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden />
              <input
                type="search"
                placeholder="Search name, email, message…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-paper py-3 pl-11 pr-4 text-sm outline-none focus:border-gold/80"
              />
            </div>

            <ul className="mt-3 space-y-2">
              {enquiries === null && <li className="p-6 text-center text-sm text-white/50">Loading…</li>}
              {enquiries !== null && visible.length === 0 && (
                <li className="flex flex-col items-center rounded-2xl border border-white/10 bg-paper p-10 text-center text-sm text-white/50">
                  <Inbox className="mb-3 h-8 w-8 text-white/30" aria-hidden />
                  {enquiries.length === 0 ? "No enquiries yet." : "No enquiries match this filter."}
                </li>
              )}
              {visible.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => open(e)}
                    className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                      selectedId === e.id ? "border-gold bg-blush" : "border-white/10 bg-paper hover:border-gold/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className={`truncate ${(e.status ?? "new") === "new" ? "font-bold" : "font-medium"}`}>{e.name}</p>
                      <StatusBadge status={e.status} />
                    </div>
                    <p className="mt-0.5 truncate text-xs text-gold-dark">{e.interest}</p>
                    <p className="mt-1.5 line-clamp-2 text-sm text-white/60">{e.message}</p>
                    <p className="mt-2 text-[0.7rem] text-white/40">{formatDate(e.createdAt)}</p>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Detail */}
          <section aria-label="Enquiry details" className={`${selected ? "" : "hidden lg:block"}`}>
            {!selected ? (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 p-10 text-center text-sm text-white/40">
                <Mail className="mb-3 h-8 w-8" aria-hidden />
                Select an enquiry to read it.
              </div>
            ) : (
              <article className="glass rounded-3xl p-6 sm:p-8 lg:sticky lg:top-24">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/50 hover:text-gold lg:hidden"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden /> Back to list
                </button>

                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-serif text-3xl leading-tight">{selected.name}</h2>
                    <p className="mt-1 text-xs text-white/50">{formatDate(selected.createdAt)}</p>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>

                <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <Mail className="h-4 w-4 flex-none text-gold" aria-hidden />
                    <a href={`mailto:${selected.email}`} className="truncate hover:text-gold-dark">{selected.email}</a>
                  </div>
                  <div className="flex min-w-0 items-center gap-2">
                    <Phone className="h-4 w-4 flex-none text-gold" aria-hidden />
                    <a href={`tel:${selected.phone?.replace(/[^\d+]/g, "")}`} className="truncate hover:text-gold-dark">{selected.phone}</a>
                  </div>
                  <div className="flex min-w-0 items-center gap-2">
                    <Building2 className="h-4 w-4 flex-none text-gold" aria-hidden />
                    <span className="truncate">{selected.organisation || "—"}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="rounded-full border border-gold/40 bg-blush px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold-light">
                      {selected.interest}
                    </span>
                  </div>
                </dl>

                <div className="mt-6 whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-paper p-5 text-[0.95rem] leading-relaxed">
                  {selected.message}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <a
                    href={replyLink}
                    onClick={() => (selected.status ?? "new") !== "replied" && changeStatus("replied")}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-dark via-gold to-[#C99B48] px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-paper"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Reply by email
                  </a>
                  <label className="sr-only" htmlFor="status-select">Status</label>
                  <select
                    id="status-select"
                    value={selected.status ?? "new"}
                    onChange={(e) => changeStatus(e.target.value)}
                    className="rounded-full border border-white/20 bg-paper px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] outline-none focus:border-gold"
                  >
                    {Object.entries(STATUSES).map(([value, s]) => (
                      <option key={value} value={value}>Mark as {s.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={remove}
                    className="ml-auto flex items-center gap-2 rounded-full border border-red-400/40 px-4 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden /> Delete
                  </button>
                </div>
              </article>
            )}
          </section>
        </div>
          </>
        )}
      </main>
    </div>
  );
}
