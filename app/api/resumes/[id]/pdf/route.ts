import { createElement } from "react";
// app/api/pdf/route.ts
import { env } from "@/env";
import { ResumeTemplateRenderer } from "@/features/editor/components/resume-template-renderer";
import { parseResumeToTemplateResume } from "@/features/editor/helpers/resume-helpers";
import { getTemplateById } from "@/features/editor/resource/templates";
import { getResume } from "@/features/resume/actions/resume.actions";
import { runWithDom } from "@/lib/dom";
import { renderReactToHtml } from "@/lib/pdf";
import { handleRouteError } from "@/lib/utils";
import { generatePdf } from "@/server/action/pdf.action";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const resume = await getResume(id);

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }


    const resumeData = parseResumeToTemplateResume(resume);
    const templateData = getTemplateById(resume.template);
    const { renderToString } = await import("react-dom/server");

    const css = await fetch(`${env.NEXT_PUBLIC_APP_URL}/css/main.css`).then(
      (res) => res.text(),
    );

    const html = runWithDom(() => {
      const content = renderToString(
        createElement(
          "div",
          { className: "resume-preview-container" },
          createElement(ResumeTemplateRenderer, {
            template: templateData,
            colorHex: resume.colorHex,
            data: resumeData,
          }),
        ),
      );
      return renderReactToHtml(css, content);
    })

    const blob = await generatePdf(html, !!templateData.noMargins);

    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set(
      "Content-Disposition",
      `attachment; filename="${resume.firstName} ${resume.lastName} - ${resume.jobTitle?.join?.("_") || "Resume"}.pdf"`,
    );
    return new NextResponse(blob, { headers });
  } catch (error) {
    return handleRouteError(error);
  }
}
