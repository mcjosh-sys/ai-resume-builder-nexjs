// app/api/pdf/route.ts
import { handleRouteError } from "@/lib/utils";
import { generatePdf } from "@/server/action/pdf.action";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { html, noMargins } = await req.json();

  try {
    return new NextResponse(await generatePdf(html, noMargins), {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
