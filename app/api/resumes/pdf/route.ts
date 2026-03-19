// app/api/pdf/route.ts
import chromium from "@sparticuz/chromium";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { html } = await req.json();

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "domcontentloaded",
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
