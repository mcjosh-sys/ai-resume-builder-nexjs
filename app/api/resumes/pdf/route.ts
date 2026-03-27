// app/api/pdf/route.ts
import chromium from "@sparticuz/chromium";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";

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
