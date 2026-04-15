import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse-fork");
import mammoth from "mammoth";
import Tesseract from "tesseract.js";

async function ocrImage(buffer, mimetype) {
  const { data: { text } } = await Tesseract.recognize(buffer, "eng", {
    logger: () => {} // silence progress logs
  });
  return text;
}

export async function extractFileContent(buffer, mimetype, originalname = "") {
  if (!buffer) throw new Error("File buffer is undefined");

  const ext = originalname.split(".").pop().toLowerCase();

  // ── PDF ──────────────────────────────────────────────────────────────────
  if (mimetype === "application/pdf" || ext === "pdf") {
    const data = await pdf(buffer);
    return data.text;
  }

  // ── Word (.docx) ─────────────────────────────────────────────────────────
  if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ext === "docx"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (
    mimetype.startsWith("image/") ||
    ["jpg", "jpeg", "png", "webp"].includes(ext)
  ) {
    return await ocrImage(buffer, mimetype);
  }

  throw new Error(`Unsupported file type: ${mimetype || ext}`);
}
