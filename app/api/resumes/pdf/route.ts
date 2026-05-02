// app/api/pdf/route.ts
import chromium from "@sparticuz/chromium";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";

async function getChromiumPath() {
  // 1. Try default (works locally / some envs)
  const defaultPath = await chromium.executablePath();
  if (defaultPath && fs.existsSync(defaultPath)) {
    return defaultPath;
  }

  // 2. Fallback: search inside .next/node_modules
  const baseDir = path.join(process.cwd(), ".next", "node_modules");

  if (fs.existsSync(baseDir)) {
    const dirs = fs.readdirSync(baseDir);

    const chromiumDir = dirs.find((d) => d.startsWith("@sparticuz/chromium"));

    if (chromiumDir) {
      const binPath = path.join(baseDir, chromiumDir, "bin", "chromium");

      if (fs.existsSync(binPath)) {
        return binPath;
      }
    }
  }

  throw new Error("Chromium binary not found");
}

export async function getExecutablePath() {
  const isLocal = process.env.NODE_ENV === "development";
  if (isLocal) {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }
  return await chromium.executablePath();
}

export async function POST(req: Request) {
  const { html } = await req.json();

  const browser = await puppeteer.launch({
    args: [
      ...chromium.args,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage", // Uses /tmp instead of memory for shared memory
      "--disable-gpu",
    ],
    executablePath: await getExecutablePath(),
    headless: true,
  });

  try {
    const t = Date.now();
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 0,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "0.6cm",
        right: "0.6cm",
        bottom: "0.6cm",
        left: "0.6cm",
      },
      printBackground: true,
    });

    await page.close();
    console.log("PDF generated in", Date.now() - t, "ms");

    return new NextResponse(
      new Blob([pdfBuffer.buffer as ArrayBuffer], { type: "application/pdf" }),
      {
        headers: {
          "Content-Type": "application/pdf",
        },
      },
    );
  } finally {
    await browser.close();
  }
}
