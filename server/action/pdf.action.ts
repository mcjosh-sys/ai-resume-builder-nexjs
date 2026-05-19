"use server";

import { Page } from "puppeteer-core";
import { getBrowser } from "./browser.action";

export async function generatePdf(html: string, noMargins: boolean) {
  console.log("Generating PDF...");
  const browser = await getBrowser();
  let page: Page | null = null;

  try {
    const t = Date.now();

    page = await browser.newPage();

    await page.emulateMediaType("print");

    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });

    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        const images = Array.from(document.images);

        if (images.length === 0) return resolve();

        let loaded = 0;

        const done = () => {
          loaded++;
          if (loaded === images.length) resolve();
        };

        images.forEach((img) => {
          if (img.complete) return done();
          img.onload = done;
          img.onerror = done;
        });
      });
    });

    const margin = noMargins ? "0cm" : "0.6cm";

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: margin,
        right: margin,
        bottom: margin,
        left: margin,
      },
      printBackground: true,
    });

    console.log("PDF generated in", Date.now() - t, "ms");

    return new Blob([pdfBuffer.buffer as ArrayBuffer], {
      type: "application/pdf",
    });
  } finally {
    await page?.close().catch(() => {});
  }
}
