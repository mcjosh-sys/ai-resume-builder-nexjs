import { ResumePreview } from "@/features/editor/components/resume-preview";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

export default async function PrintResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  // Fetch all necessary resume data for the template renderer
  const resume = await prisma.resume.findUnique({
    where: {
      id,
      userId: user.id,
    },
    include: {
      workExperiences: { orderBy: { order: "asc" } },
      educations: { orderBy: { order: "asc" } },
      projects: { orderBy: { order: "asc" } },
      certifications: { orderBy: { order: "asc" } },
      awards: { orderBy: { order: "asc" } },
      skills: true,
      links: true,
      sections: { orderBy: { order: "asc" } },
    },
  });

  if (!resume) {
    notFound();
  }

  // Transform db payload to the format expected by the template layout
  const mappedData = {
    firstName: resume.firstName ?? undefined,
    lastName: resume.lastName ?? undefined,
    jobTitle: resume.title ?? undefined,
    email: resume.email ?? undefined,
    phone: resume.phone ?? undefined,
    city: resume.city ?? undefined,
    country: resume.country ?? undefined,
    photoUrl: resume.photoUrl ?? undefined,
    summary: resume.summary ?? undefined,
    links: resume.links.map((l) => ({ name: l.name, url: l.url })),

    // sections
    experience: resume.workExperiences.map((xp) => ({
      company: xp.company ?? undefined,
      position: xp.position ?? undefined,
      city: xp.city ?? undefined,
      country: xp.country ?? undefined,
      startDate: xp.startDate ? xp.startDate.toISOString() : undefined,
      endDate: xp.endDate ? xp.endDate.toISOString() : undefined,
      isCurrent: xp.isCurrent,
      description: xp.description ?? undefined,
    })),

    education: resume.educations.map((edu) => ({
      school: edu.school ?? undefined,
      degree: edu.degree ?? undefined,
      city: edu.city ?? undefined,
      country: edu.country ?? undefined,
      startDate: edu.startDate ? edu.startDate.toISOString() : undefined,
      endDate: edu.endDate ? edu.endDate.toISOString() : undefined,
      isCurrent: edu.isCurrent,
      description: edu.description ?? undefined,
    })),

    projects: resume.projects.map((proj) => ({
      title: proj.title ?? undefined,
      description: proj.description ?? undefined,
      url: proj.url ?? undefined,
      startDate: proj.startDate ? proj.startDate.toISOString() : undefined,
      endDate: proj.endDate ? proj.endDate.toISOString() : undefined,
    })),

    certifications: resume.certifications.map((cert) => ({
      name: cert.name ?? undefined,
      issuer: cert.issuer ?? undefined,
      issueDate: cert.issueDate ? cert.issueDate.toISOString() : undefined,
      expiryDate: cert.expiryDate ? cert.expiryDate.toISOString() : undefined,
      credentialUrl: cert.credentialUrl ?? undefined,
    })),

    awards: resume.awards.map((award) => ({
      title: award.title ?? undefined,
      issuer: award.issuer ?? undefined,
      date: award.date ? award.date.toISOString() : undefined,
      description: award.description ?? undefined,
    })),

    skills: resume.skills.map((s) => ({
      name: s.name,
      level: s.level ?? undefined,
      category: undefined,
    })),

    // Reconstruct sections array for correct rendering order
    sections: resume.sections as any,
  };

  // The template object to supply the style settings. Based off local context mappings usually
  const templateConfig = {
    id: resume.template,
    name: resume.template.charAt(0).toUpperCase() + resume.template.slice(1),
    accent: "bg-blue-500 text-blue-500 shadow-blue-500", // Fallback, could be dynamically fetched based on template
    description: "",
    preview: {
      title: "",
      subtitle: "",
    },
  };

  return (
    <div className="bg-white min-h-screen grid place-items-center sm:p-8 justify-center">
      {/* We reuse the ResumePreview component without editor chrome wrappers to allow for raw printing */}
      <div className="w-198.5 h-280.75 bg-white shadow-2xl print:shadow-none relative overflow-hidden">
        <style
          dangerouslySetInnerHTML={{
            __html: `
                @page { size: A4; margin: 0; }
                body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                /* Apply custom hex if present */
                ${
                  resume.colorHex !== "default"
                    ? `
                  .bg-blue-500 { background-color: ${resume.colorHex} !important; }
                  .text-blue-500 { color: ${resume.colorHex} !important; }
                  .border-blue-500 { border-color: ${resume.colorHex} !important; }
                  .shadow-blue-500 { box-shadow: 0 4px 6px -1px ${resume.colorHex} !important; }
                `
                    : ""
                }
             `,
          }}
        />
        <ResumePreview
          template={templateConfig}
          overrideData={mappedData}
          forceColor={resume.colorHex}
        />
      </div>
    </div>
  );
}
