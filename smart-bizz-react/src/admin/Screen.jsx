/** Centered full-height backdrop used by the admin login / loading / denied screens. */
export default function Screen({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#F4FBFE_0%,#E3F4FB_40%,#D0EBF7_100%)] px-4">
      {children}
    </div>
  );
}
