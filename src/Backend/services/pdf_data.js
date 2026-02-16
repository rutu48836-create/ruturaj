
import fs from "fs"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const pdf = require("pdf-parse")


export async function extractPDFText(buffer) {
  if (!buffer) {
    throw new Error("PDF buffer is undefined");
  }

  const data = await pdf(buffer);
  return data.text;
}