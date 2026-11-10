import { useState } from "react";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { CircleAlert, LoaderCircle, LogIn } from "lucide-react";
import { site } from "../config/site";
import Screen from "./Screen";

const friendlyError = (code) => {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/operation-not-allowed":
    case "auth/configuration-not-found":
      return "Email/password sign-in is not enabled yet. Turn it on in Firebase console → Authentication → Sign-in method.";
    default:
      return "Sign-in failed. Please try again.";
  }
};

export default function AdminLogin({ auth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setInfo("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(friendlyError(err.code));
      setBusy(false);
    }
  };

  const resetPassword = async () => {
    setError("");
    setInfo("");
    if (!email.trim()) return setError("Enter your email above first.");
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch {
      /* don't reveal whether the account exists */
    }
    setInfo("If that account exists, a password reset email has been sent.");
  };

  const inputClass =
    "w-full rounded-2xl border border-white/15 bg-paper px-5 py-3.5 text-[0.95rem] text-white outline-none transition-all hover:border-white/25 focus:border-gold/80 focus:shadow-[0_0_0_4px_rgba(185,138,53,.14)]";

  return (
    <Screen>
      <form onSubmit={submit} className="glass w-full max-w-md rounded-[2rem] p-8 sm:p-10">
        <div className="flex items-center gap-3">
          <img src={site.logo} alt="" className="h-12 w-12 object-contain" />
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="font-serif text-2xl leading-tight">
              Smart Bizz <span className="text-gold">Research Hub</span>
            </h1>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block pl-2 text-[0.65rem] uppercase tracking-[0.18em] text-white/50">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block pl-2 text-[0.65rem] uppercase tracking-[0.18em] text-white/50">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 flex items-center gap-2 rounded-2xl border border-red-400/40 bg-red-50 p-3 text-sm text-red-800">
            <CircleAlert className="h-4 w-4 flex-none" aria-hidden /> {error}
          </p>
        )}
        {info && (
          <p className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-50 p-3 text-sm text-emerald-800">{info}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-dark via-gold to-[#C99B48] px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-paper shadow-[0_12px_32px_-14px_rgba(148,102,31,.6)] disabled:opacity-60"
        >
          {busy ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> : <LogIn className="h-4 w-4" aria-hidden />}
          Sign in
        </button>
        <button
          type="button"
          onClick={resetPassword}
          className="mt-4 w-full text-center text-xs text-white/50 underline-offset-4 hover:text-gold-dark hover:underline"
        >
          Forgot password?
        </button>
        <a href="/" className="mt-6 block text-center text-xs uppercase tracking-[0.22em] text-white/40 hover:text-gold">
          ← Back to website
        </a>
      </form>
    </Screen>
  );
}
