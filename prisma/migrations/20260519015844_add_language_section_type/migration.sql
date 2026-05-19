-- CreateEnum
CREATE TYPE "LanguageLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'FLUENT', 'NATIVE');

-- AlterEnum
ALTER TYPE "SectionType" ADD VALUE 'LANGUAGE';

-- CreateTable
CREATE TABLE "languages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" "LanguageLevel" NOT NULL DEFAULT 'BEGINNER',
    "resumeId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "languages_resumeId_idx" ON "languages"("resumeId");

-- AddForeignKey
ALTER TABLE "languages" ADD CONSTRAINT "languages_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
