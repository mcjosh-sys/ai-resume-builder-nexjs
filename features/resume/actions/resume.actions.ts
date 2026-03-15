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
  colorHex?: string;
  template?: string;
  title?: string | null;
  summary?: string | null;
  jobTitle?: string | null;
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
    },
  });
  return resume;
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
    phone: _,
    ...rest
  } = data;
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
    phone: _,
    ...rest
  } = data;
  console.log({ sections });
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
    },
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

  let newPhotoUrl: string | null | undefined = null;
  const fileKey = existing?.photoUrl?.split("/").pop();
  console.log({ fileKey });
  if (photo instanceof File) {
    if (fileKey) {
      const res = await deleteImage(fileKey);
      console.log(res);
    }
    newPhotoUrl = await uploadImage(photo, userId);
  } else if (photo === null) {
    if (fileKey) {
      const res = await deleteImage(fileKey);
      console.log(res);
    }
    newPhotoUrl = null;
  }

  rest.photoUrl = newPhotoUrl;

  if (id) {
    return await updateResume(userId, id, rest);
  }

  return await createResume(userId, rest);
}
