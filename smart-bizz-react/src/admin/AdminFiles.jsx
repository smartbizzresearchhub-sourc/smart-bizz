import { useCallback, useEffect, useState } from "react";
import { CircleAlert, Download, FileText, FileUp, LoaderCircle, LockKeyhole, RefreshCw, Trash2 } from "lucide-react";
import {
  deleteAdminFile,
  downloadAdminFile,
  listAdminFiles,
  uploadAdminFile,
} from "../lib/adminStorage";

const ACCEPTED_FILES =
  ".jpg,.jpeg,.png,.webp,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx";

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminFiles({ user }) {
  const [files, setFiles] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    setError("");
    try {
      setFiles(await listAdminFiles(user.uid));
    } catch (err) {
      console.error("[Admin files] Could not load files:", err);
      setError("Could not load private files. Check that Firebase Storage is enabled and its rules are deployed.");
      setFiles([]);
    }
  }, [user.uid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setBusy(true);
    setError("");
    setNotice("");
    try {
      await uploadAdminFile(user.uid, file);
      setNotice("File uploaded to private storage.");
      await refresh();
    } catch (err) {
      console.error("[Admin files] Upload failed:", err);
      setError(err.message || "Could not upload this file.");
    } finally {
      setBusy(false);
    }
  };

  const download = async (file) => {
    setBusy(true);
    setError("");
    try {
      const blob = await downloadAdminFile(user.uid, file.fullPath);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("[Admin files] Download failed:", err);
      setError("Could not download the file. Check the Storage CORS settings if the error persists.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (file) => {
    if (!window.confirm(`Delete "${file.name}"? This cannot be undone.`)) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await deleteAdminFile(user.uid, file.fullPath);
      setFiles((current) => current.filter((entry) => entry.fullPath !== file.fullPath));
      setNotice("File deleted.");
    } catch (err) {
      console.error("[Admin files] Delete failed:", err);
      setError("Could not delete the file.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-paper p-5 sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-4 w-4 text-gold-dark" aria-hidden />
            <h2 className="font-serif text-2xl">Private files</h2>
          </div>
          <p className="mt-1 text-sm text-white/55">
            Images and documents up to 10 MB. Only your admin account can access these files.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refresh}
            disabled={busy}
            className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] hover:border-gold disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden /> Refresh
          </button>
          <label className={`flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-gold-dark via-gold to-[#C99B48] px-4 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-paper ${busy ? "pointer-events-none opacity-50" : ""}`}>
            {busy ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <FileUp className="h-3.5 w-3.5" aria-hidden />}
            Upload file
            <input
              type="file"
              accept={ACCEPTED_FILES}
              onChange={upload}
              disabled={busy}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 flex items-center gap-2 rounded-2xl border border-red-400/40 bg-red-50 p-4 text-sm text-red-800">
          <CircleAlert className="h-4 w-4 flex-none" aria-hidden /> {error}
        </p>
      )}
      {notice && <p role="status" className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</p>}

      <ul className="mt-4 space-y-2">
        {files === null && (
          <li className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-paper p-8 text-sm text-white/50">
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> Loading files…
          </li>
        )}
        {files?.length === 0 && !error && (
          <li className="flex flex-col items-center rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-white/50">
            <FileText className="mb-3 h-8 w-8 text-white/30" aria-hidden />
            No private files yet.
          </li>
        )}
        {files?.map((file) => (
          <li key={file.fullPath} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-paper p-4">
            <div className="flex min-w-0 items-center gap-3">
              <FileText className="h-5 w-5 flex-none text-gold-dark" aria-hidden />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{file.name}</p>
                <p className="mt-1 text-xs text-white/45">
                  {formatSize(Number(file.size))} · {formatDate(file.timeCreated)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => download(file)}
                disabled={busy}
                aria-label={`Download ${file.name}`}
                className="rounded-full border border-white/20 p-2.5 hover:border-gold hover:text-gold-dark disabled:opacity-50"
              >
                <Download className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => remove(file)}
                disabled={busy}
                aria-label={`Delete ${file.name}`}
                className="rounded-full border border-red-400/40 p-2.5 text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
