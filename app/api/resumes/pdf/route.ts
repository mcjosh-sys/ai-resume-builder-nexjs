// app/api/pdf/route.ts
import chromium from "@sparticuz/chromium-min";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";

export async function getExecutablePath() {
  const isLocal = process.env.NODE_ENV === "development";
  if (isLocal) {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }
  return await chromium.executablePath(
    `https://github.com/Sparticuz/chromium/releases/download/v148.0.0/chromium-v148.0.0-pack.x64.tar`,
  );
}

export async function getBrowser() {
  return puppeteer.launch({
    args: [
      ...chromium.args,
      "--hide-scrollbars",
      "--disable-web-security",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
    executablePath: await getExecutablePath(),
    headless: true,
  });
}

export async function POST(req: Request) {
  const { html, noMargins } = await req.json();

  // const browser = await puppeteer.launch({
  //   args: [
  //     ...chromium.args,
  //     "--no-sandbox",
  //     "--disable-setuid-sandbox",
  //     "--disable-dev-shm-usage", // Uses /tmp instead of memory for shared memory
  //     "--disable-gpu",
  //   ],
  //   executablePath: await getExecutablePath(),
  //   headless: true,
  // });
  console.log("Generating PDF...");
  const browser = await getBrowser();

  try {
    const t = Date.now();
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 0,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: noMargins
        ? {
            top: "0cm",
            right: "0cm",
            bottom: "0cm",
            left: "0cm",
          }
        : {
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
