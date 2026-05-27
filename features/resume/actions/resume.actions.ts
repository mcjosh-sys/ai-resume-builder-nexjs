"use server";
import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { Prisma } from "@/lib/generated/prisma";
import { deleteImage, getUserId, uploadImage } from "@/server/action";

export type RawResume = {
  id?: string;
  photo?: File | null;
  photoUrl?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  jobDescription?: string | null;
  atsScore?: number | null;
  colorHex?: string;
  template?: string;
  title?: string | null;
  summary?: string | null;
  jobTitle?: string[];
  city?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  workExperiences?: Prisma.WorkExperienceCreateManyResumeInput[];
  educations?: Prisma.EducationCreateManyResumeInput[];
  otherFields?: Prisma.OtherFieldCreateManyResumeInput[];
  sections?: Prisma.SectionCreateManyResumeInput[];
  links?: Prisma.LinkCreateManyResumeInput[];
  skills?: Prisma.SkillCreateManyResumeInput[];
  projects?: Prisma.ProjectCreateManyResumeInput[];
  certifications?: Prisma.CertificationCreateManyResumeInput[];
  awards?: Prisma.AwardCreateManyResumeInput[];
  languages?: Prisma.LanguageCreateManyResumeInput[];
  updatedAt?: Date;
  createdAt?: Date;
};

export async function getResume(id: string) {
  const userId = await getUserId();

  const resume = await prisma.resume.findUnique({
    where: { id, userId },
    include: {
      workExperiences: true,
      educations: true,
      otherFields: {
        orderBy: { order: "asc" },
      },
      sections: {
        orderBy: { order: "asc" },
      },
      links: true,
      skills: true,
      projects: {
        orderBy: { order: "asc" },
      },
      certifications: {
        orderBy: { order: "asc" },
      },
      awards: {
        orderBy: { order: "asc" },
      },
      languages: {
        orderBy: { order: "asc" },
      },
    },
  });
  return resume;
}

function calculateAtsScore(data: Partial<RawResume>): number {
  let atsScore = 0;

  // Core profile (30%)
  if (data.firstName && data.lastName) atsScore += 10;
  if (data.summary && data.summary.length > 50) atsScore += 20;

  // Experience (30%)
  const expCount = data.workExperiences?.length || 0;
  if (expCount > 0) {
    atsScore += Math.min(30, expCount * 10);
  }

  // Education (15%)
  const eduCount = data.educations?.length || 0;
  if (eduCount > 0) atsScore += 15;

  // Skills (15%)
  const skillsCount = data.skills?.length || 0;
  if (skillsCount > 4) atsScore += 15;
  else if (skillsCount > 0) atsScore += 5;

  // Extras (10%)
  const projCount = data.projects?.length || 0;
  const certCount = data.certifications?.length || 0;
  if (projCount > 0 || certCount > 0) {
    atsScore += 10;
  }

  return atsScore;
}

export async function createResume(
  userId: string,
  data: Omit<RawResume, "id" | "photoUrl">,
) {
  const {
    workExperiences,
    educations,
    otherFields,
    links,
    skills,
    sections,
    projects,
    certifications,
    awards,
    languages,
    phone: _,
    ...rest
  } = data;

  // const atsScore = calculateAtsScore(data);

  return await prisma.resume.create({
    data: {
      ...rest,
      userId,
      workExperiences: {
        create: workExperiences,
      },
      educations: {
        create: educations,
      },
      otherFields: {
        create: otherFields,
      },
      links: {
        create: links?.filter((link) => link.name && link.url) as any,
      },
      sections: {
        create: sections ?? [],
      },
      skills: {
        create: skills ?? [],
      },
      projects: {
        create: projects ?? [],
      },
      certifications: {
        create: certifications ?? [],
      },
      awards: {
        create: awards ?? [],
      },
      languages: {
        create: languages ?? [],
      },
    },
  });
}

export async function updateResume(
  userId: string,
  id: string,
  data: RawResume,
) {
  const {
    workExperiences,
    educations,
    otherFields,
    links,
    skills,
    sections,
    projects,
    certifications,
    awards,
    languages,
    photo: _,
    ...rest
  } = data;

  // const atsScore = calculateAtsScore(data);

  return await prisma.resume.update({
    where: { id, userId },
    data: {
      ...rest,
      userId,
      links: {
        deleteMany: {},
        create: links?.filter((link) => link.name && link.url) as any,
      },
      workExperiences: {
        deleteMany: {},
        create: workExperiences,
      },
      educations: {
        deleteMany: {},
        create: educations,
      },
      otherFields: {
        deleteMany: {},
        create: otherFields,
      },
      sections: {
        deleteMany: {},
        create: sections ?? [],
      },
      skills: {
        deleteMany: {},
        create: skills ?? [],
      },
      projects: {
        deleteMany: {},
        create: projects ?? [],
      },
      certifications: {
        deleteMany: {},
        create: certifications ?? [],
      },
      awards: {
        deleteMany: {},
        create: awards ?? [],
      },
      languages: {
        deleteMany: {},
        create: languages ?? [],
      },
    },
  });
}

export async function getUserResumes(limit?: number) {
  const userId = await getUserId();
  return prisma.resume.findMany({
    where: { userId, isDeleted: false },
    orderBy: { updatedAt: "desc" },
    ...(limit ? { take: limit } : {}),
    select: {
      id: true,
      title: true,
      description: true,
      template: true,
      photoUrl: true,
      firstName: true,
      lastName: true,
      updatedAt: true,
      createdAt: true,
      atsScore: true,
    },
  });
}

export async function deleteResume(id: string) {
  const userId = await getUserId();
  return prisma.resume.update({
    where: { id, userId },
    data: { isDeleted: true },
  });
}

export async function cloneResume(id: string) {
  const userId = await getUserId();

  const source = await prisma.resume.findUnique({
    where: { id, userId },
    include: {
      workExperiences: true,
      educations: true,
      otherFields: { orderBy: { order: "asc" } },
      sections: { orderBy: { order: "asc" } },
      links: true,
      skills: true,
      projects: { orderBy: { order: "asc" } },
      certifications: { orderBy: { order: "asc" } },
      awards: true,
      languages: { orderBy: { order: "asc" } },
    },
  });

  if (!source) throw new AppError("Resume not found", { status: 404 });

  const strip = <T extends { id: string; resumeId: string }>(
    items: T[],
  ): Omit<T, "id" | "resumeId">[] =>
    items.map(({ id: _id, resumeId: _rid, ...rest }) => rest as Omit<T, "id" | "resumeId">);

  return prisma.resume.create({
    data: {
      userId,
      title: `Copy of ${source.title ?? "Untitled Resume"}`,
      description: source.description,
      template: source.template,
      colorHex: source.colorHex,
      photoUrl: source.photoUrl,
      firstName: source.firstName,
      lastName: source.lastName,
      jobTitle: source.jobTitle,
      summary: source.summary,
      city: source.city,
      country: source.country,
      email: source.email,
      jobDescription: source.jobDescription,
      workExperiences: { create: strip(source.workExperiences) },
      educations: { create: strip(source.educations) },
      otherFields: { create: strip(source.otherFields) },
      sections: { create: strip(source.sections) },
      links: { create: strip(source.links) },
      skills: { create: strip(source.skills) },
      projects: { create: strip(source.projects) },
      certifications: { create: strip(source.certifications) },
      awards: { create: strip(source.awards) },
      languages: { create: strip(source.languages) },
    },
  });
}

export async function renameResume(id: string, title: string) {
  const userId = await getUserId();
  return prisma.resume.update({
    where: { id, userId },
    data: { title },
  });
}

export async function saveResume(data: RawResume) {
  const { id, photo, ...rest } = data;
  const userId = await getUserId();
  if (!userId) throw new AppError("Unauthorized", { status: 401 });

  const existing = id ? await getResume(id) : null;

  if (id && !existing) {
    throw new AppError("Resume not found", { status: 404 });
  }

  let newPhotoUrl: string | null | undefined = rest.photoUrl;
  const fileKey = existing?.photoUrl?.split("/").pop();
  if (photo instanceof File) {
    if (fileKey) {
      await deleteImage(fileKey);
    }
    newPhotoUrl = await uploadImage(photo, userId);
  } else if (photo === null) {
    if (fileKey) {
      await deleteImage(fileKey);
    }
    newPhotoUrl = null;
  }

  rest.photoUrl = newPhotoUrl;

  if (id) {
    return await updateResume(userId, id, rest);
  }

  return await createResume(userId, rest);
}
