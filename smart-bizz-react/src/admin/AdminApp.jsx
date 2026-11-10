import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { LoaderCircle, ShieldAlert } from "lucide-react";
import { app, missingFirebaseEnv } from "../firebase";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import Screen from "./Screen";

const ADMIN_UID = "g3g2aoFniFW0vHYM6Qs7Kci6CJ32";

/**
 * /admin entry point.
 * Only the explicitly allowlisted Firebase Authentication user gets in.
 */
export default function AdminApp() {
  if (missingFirebaseEnv.length > 0) {
    return (
      <Screen>
        <div className="glass max-w-xl rounded-3xl p-8">
          <ShieldAlert className="mx-auto h-10 w-10 text-red-600" aria-hidden />
          <h1 className="mt-4 text-center font-serif text-3xl">Firebase configuration missing</h1>
          <p className="mt-3 text-center text-sm text-white/65">
            Add these environment variables in Vercel for the{" "}
            <code className="text-white">smart-bizz-react</code> project, then redeploy:
          </p>
          <ul className="mt-4 space-y-1 text-center font-mono text-xs text-white/75">
            {missingFirebaseEnv.map((name) => <li key={name}>{name}</li>)}
          </ul>
          <a
            href="/"
            className="mt-6 block text-center text-xs uppercase tracking-[0.22em] text-white/50 hover:text-gold"
          >
            Back to website
          </a>
        </div>
      </Screen>
    );
  }

  return <AuthenticatedAdminApp />;
}

function AuthenticatedAdminApp() {
  const auth = getAuth(app);
  const [state, setState] = useState({ status: "loading", user: null });

  useEffect(() => {
    document.title = "Admin — Smart Bizz Research Hub";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);

    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) return setState({ status: "signed-out", user: null });
      setState({ status: user.uid === ADMIN_UID ? "admin" : "denied", user });
    }, (error) => {
      console.error("[Admin auth] Could not restore the Firebase session:", error);
      setState({ status: "auth-error", user: null, error });
    });
    return () => {
      unsub();
      robots.remove();
    };
  }, []);

  const logout = () => signOut(auth);

  if (state.status === "loading") {
    return (
      <Screen>
        <LoaderCircle className="h-8 w-8 animate-spin text-gold" aria-label="Loading" />
      </Screen>
    );
  }

  if (state.status === "auth-error") {
    return (
      <Screen>
        <div className="glass max-w-md rounded-3xl p-8 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-red-600" aria-hidden />
          <h1 className="mt-4 font-serif text-3xl">Could not connect to Firebase</h1>
          <p role="alert" className="mt-3 text-sm text-white/65">
            Authentication failed ({state.error?.code || "unknown error"}). Check the Firebase
            environment variables in Vercel and redeploy.
          </p>
        </div>
      </Screen>
    );
  }

  if (state.status === "signed-out") return <AdminLogin auth={auth} />;

  if (state.status === "denied") {
    return (
      <Screen>
        <div className="glass max-w-md rounded-3xl p-8 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-red-600" aria-hidden />
          <h1 className="mt-4 font-serif text-3xl">Access denied</h1>
          <p className="mt-3 text-sm text-white/65">
            <span className="font-semibold text-white">{state.user?.email}</span> is signed in but is
            not an admin.
          </p>
          <p className="mt-3 break-all text-xs text-white/50">
            This account's UID is not on the admin allowlist. Sign in with the authorized admin account.
          </p>
          <button
            type="button"
            onClick={logout}
            className="mt-6 rounded-full border border-white/20 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] hover:border-gold hover:text-gold-dark"
          >
            Sign out
          </button>
        </div>
      </Screen>
    );
  }

  return <AdminDashboard user={state.user} onLogout={logout} />;
}
