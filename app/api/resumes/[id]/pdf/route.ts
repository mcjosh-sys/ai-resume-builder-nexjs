import { createElement } from "react";
// app/api/pdf/route.ts
import { env } from "@/env";
import { ResumeTemplateRenderer } from "@/features/editor/components/resume-template-renderer";
import { parseResumeToTemplateResume } from "@/features/editor/helpers/resume-helpers";
import { getTemplateById } from "@/features/editor/resource/templates";
import { getResume } from "@/features/resume/actions/resume.actions";
import { renderReactToHtml } from "@/lib/pdf";
import { NextResponse } from "next/server";
import { getBrowser } from "../../pdf/route";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const resume = await getResume(id);

  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const resumeData = parseResumeToTemplateResume(resume);
  const { renderToString } = await import("react-dom/server");
  const content = renderToString(
    createElement(
      "div",
      { className: "resume-preview-container" },
      createElement(ResumeTemplateRenderer, {
        template: getTemplateById(resume.template),
        colorHex: resume.colorHex,
        data: resumeData,
      }),
    ),
  );
  const css = await fetch(`${env.NEXT_PUBLIC_APP_URL}/css/pdf.css`).then(
    (res) => res.text(),
  );
  const html = renderReactToHtml(css, content);

  const t = Date.now();
  const browser = await getBrowser();

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
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
          "Content-Disposition": `attachment; filename="${resume.firstName}_${resume.lastName}_${resume.jobTitle}.pdf"`,
        },
      },
    );
  } finally {
    await browser.close();
  }
}
