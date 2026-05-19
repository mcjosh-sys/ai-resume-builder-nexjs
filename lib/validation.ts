import { z } from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));

export const headerSchema = z.object({
  photo: z
    .custom<File | null | undefined>()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "Must be an image file",
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 4,
      "File must be less than 4MB",
    ),
  jobTitle: optionalString,
  firstName: optionalString,
  lastName: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: z.email().optional(),
  links: z
    .array(
      z.object({
        name: z.string(),
        url: z.url(),
      }),
    )
    .optional(),
});

export type HeaderValues = z.infer<typeof headerSchema>;
export type LinkValues = z.infer<typeof headerSchema>["links"];
export type LinkInput = NonNullable<LinkValues>[number];

export const summarySchema = z.object({
  summary: optionalString,
});

export type SummaryValues = z.infer<typeof summarySchema>;

export const educationSchema = z.object({
  educations: z
    .array(
      z.object({
        degree: optionalString,
        school: optionalString,
        startDate: optionalString,
        endDate: optionalString,
      }),
    )
    .optional(),
});

export type EducationValues = z.infer<typeof educationSchema>;

export type Education = NonNullable<
  z.infer<typeof educationSchema>["educations"]
>[number];

export const workExperienceSchema = z.object({
  workExperiences: z
    .array(
      z.object({
        position: optionalString,
        company: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
      }),
    )
    .optional(),
});

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>;

export type WorkExperience = NonNullable<
  z.infer<typeof workExperienceSchema>["workExperiences"]
>[number];

export const skillSchema = z.object({
  skills: z
    .array(
      z.object({
        name: optionalString,
        level: optionalString,
        category: optionalString,
      }),
    )
    .optional(),
});

export type SkillValues = z.infer<typeof skillSchema>;

export type Skill = NonNullable<z.infer<typeof skillSchema>["skills"]>[number];

export const languageSchema = z.object({
  languages: z
    .array(
      z.object({
        name: optionalString,
        level: optionalString,
      }),
    )
    .optional(),
});

export type LanguageValues = z.infer<typeof languageSchema>;

export type Language = NonNullable<
  z.infer<typeof languageSchema>["languages"]
>[number];

export const otherFieldSchema = z
  .object({
    title: optionalString,
    subtitle: optionalString,
    description: optionalString,
    startDate: optionalString,
    endDate: optionalString,
  })
  .optional();

export type OtherFieldValues = z.infer<typeof otherFieldSchema>;

export type OtherField = NonNullable<z.infer<typeof otherFieldSchema>>;

export const projectSchema = z.object({
  projects: z
    .array(
      z.object({
        title: optionalString,
        description: optionalString,
        url: optionalString,
        startDate: optionalString,
        endDate: optionalString,
      }),
    )
    .optional(),
});

export type ProjectValues = z.infer<typeof projectSchema>;
export type Project = NonNullable<
  z.infer<typeof projectSchema>["projects"]
>[number];

export const certificationSchema = z.object({
  certifications: z
    .array(
      z.object({
        name: optionalString,
        issuer: optionalString,
        issueDate: optionalString,
        expiryDate: optionalString,
        credentialUrl: optionalString,
      }),
    )
    .optional(),
});

export type CertificationValues = z.infer<typeof certificationSchema>;
export type Certification = NonNullable<
  z.infer<typeof certificationSchema>["certifications"]
>[number];

export const awardSchema = z.object({
  awards: z
    .array(
      z.object({
        title: optionalString,
        issuer: optionalString,
        date: optionalString,
        description: optionalString,
      }),
    )
    .optional(),
});

export type AwardValues = z.infer<typeof awardSchema>;
export type Award = NonNullable<z.infer<typeof awardSchema>["awards"]>[number];

export const resumeSchema = z.object({
  ...headerSchema.shape,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillSchema.shape,
  otherFields: z.array(otherFieldSchema).optional(),
  colorHex: optionalString,
  borderStyle: optionalString,
});

export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string;
};
