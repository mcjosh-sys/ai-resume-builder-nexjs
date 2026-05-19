"use server";

import chromium from "@sparticuz/chromium-min";
import puppeteer, { Browser } from "puppeteer-core";

let browser: Browser | null = null;
let launchPromise: Promise<Browser> | null = null;
let closingPromise: Promise<void> | null = null;

const IDLE_TIMEOUT = 1000 * 60 * 2;

let lastUsed = Date.now();
let closingTimeout: NodeJS.Timeout | null = null;

async function getExecutablePath() {
  const isLocal = process.env.NODE_ENV === "development";
  if (isLocal) {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }
  return await chromium.executablePath(
    `https://github.com/Sparticuz/chromium/releases/download/v148.0.0/chromium-v148.0.0-pack.x64.tar`,
  );
}

async function launchBrowser() {
  if (browser && browser.connected) return browser;

  if (launchPromise) {
    return launchPromise;
  }

  launchPromise = (async () => {
    const executablePath = await getExecutablePath();
    const instance = await puppeteer.launch({
      args: [
        ...chromium.args,
        "--hide-scrollbars",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
      executablePath,
      headless: true,
    });

    browser = instance;
    launchPromise = null;

    return instance;
  })();

  return launchPromise;
}

function scheduleBrowserClose() {
  if (closingTimeout) clearTimeout(closingTimeout);

  closingTimeout = setTimeout(async () => {
    const idleTime = Date.now() - lastUsed;

    if (idleTime < IDLE_TIMEOUT || !browser || closingPromise) return;

    const b = browser;

    browser = null;

    closingPromise = (async () => {
      try {
        console.log("Closing browser...");
        await b.close();
        console.log("Browser closed");
      } finally {
        closingPromise = null;
        closingTimeout = null;
      }
    })();
  }, IDLE_TIMEOUT);
}

export async function getBrowser(): Promise<Browser> {
  console.log("Getting browser...");
  const t = Date.now();
  if (closingPromise) {
    await closingPromise;
  }

  lastUsed = Date.now();

  const instance = await launchBrowser();
  scheduleBrowserClose();

  console.log("Browser ready in", Date.now() - t, "ms");
  return instance;
}
