import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const maxDuration = 60; // Set Vercel execution timeout to 60 seconds

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const resume = await prisma.resume.findUnique({
      where: {
        id,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!resume) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Use environment URL or fallback to localhost
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3600";
    const printUrl = `${appUrl}/resume/${id}/print`;

    // Configure Sparticuz Chromium for serverless environments
    const isDev = process.env.NODE_ENV === "development";
    let browser;

    if (isDev) {
      // Use the full puppeteer library local build in development
      const puppeteerDev = require("puppeteer");
      browser = await puppeteerDev.launch({
        headless: true,
      });
    } else {
      // Vercel deployment uses headless chromium
      const executablePath = await chromium.executablePath();
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: (chromium as any).defaultViewport,
        executablePath: executablePath || process.env.CHROME_EXECUTABLE_PATH,
        headless: (chromium as any).headless === true ? true : false,
      });
    }

    const page = await browser.newPage();

    // Inject current session cookies into Puppeteer so it bypasses Clerk authentication
    const cookieStore = await cookies();
    const cookiesList = cookieStore.getAll();
    const domain = new URL(appUrl).hostname;
    
    if (cookiesList.length > 0) {
      await page.setCookie(
        ...cookiesList.map((c) => ({
          name: c.name,
          value: c.value,
          domain: domain,
          path: "/",
        }))
      );
    }

    // Navigate to the print page. We use DOMContentLoaded locally to prevent single-thread dev server deadlocks 
    await page.goto(printUrl, {
      waitUntil: isDev ? "domcontentloaded" : "networkidle0",
      timeout: isDev ? 15000 : 30000,
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    });

    await browser.close();

    // Return the PDF buffer
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="resume-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[RESUME_PDF_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
