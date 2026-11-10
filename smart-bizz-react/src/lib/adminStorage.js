import {
  deleteObject,
  getBlob,
  getMetadata,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { app } from "../firebase";
import { getStorage } from "firebase/storage";

const storage = getStorage(app);
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

function getAdminFileRef(uid, fullPath) {
  const expectedPrefix = `admin-uploads/${uid}/`;
  if (!fullPath.startsWith(expectedPrefix)) {
    throw new Error("Invalid admin file path.");
  }
  return ref(storage, fullPath);
}

export async function uploadAdminFile(uid, file) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Files must be 10 MB or smaller.");
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Choose a supported image or document file.");
  }

  const safeName = file.name.replace(/[^\w.-]+/g, "_").slice(-120) || "upload";
  const path = `admin-uploads/${uid}/${crypto.randomUUID()}-${safeName}`;
  await uploadBytes(ref(storage, path), file, { contentType: file.type });
}

export async function listAdminFiles(uid) {
  const result = await listAll(ref(storage, `admin-uploads/${uid}`));
  const files = await Promise.all(result.items.map((item) => getMetadata(item)));
  return files.sort((a, b) => new Date(b.timeCreated) - new Date(a.timeCreated));
}

export function deleteAdminFile(uid, fullPath) {
  return deleteObject(getAdminFileRef(uid, fullPath));
}

export function downloadAdminFile(uid, fullPath) {
  return getBlob(getAdminFileRef(uid, fullPath));
}
