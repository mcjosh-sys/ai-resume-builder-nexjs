/*
  Warnings:

  - You are about to drop the `section_orders` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SectionType" ADD VALUE 'PROJECT';
ALTER TYPE "SectionType" ADD VALUE 'CERTIFICATION';
ALTER TYPE "SectionType" ADD VALUE 'AWARD';

-- DropForeignKey
ALTER TABLE "section_orders" DROP CONSTRAINT "section_orders_otherFieldId_fkey";

-- DropForeignKey
ALTER TABLE "section_orders" DROP CONSTRAINT "section_orders_resumeId_fkey";

-- DropTable
DROP TABLE "section_orders";

-- CreateTable
CREATE TABLE "sections" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "sectionType" "SectionType" NOT NULL,
    "order" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "icon" TEXT NOT NULL DEFAULT 'star',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "sidebarDescription" TEXT NOT NULL DEFAULT '',
    "otherFieldId" TEXT,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "url" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "issuer" TEXT,
    "issueDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "credentialUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "awards" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "issuer" TEXT,
    "date" TIMESTAMP(3),
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "awards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sections_otherFieldId_key" ON "sections"("otherFieldId");

-- CreateIndex
CREATE INDEX "sections_resumeId_idx" ON "sections"("resumeId");

-- CreateIndex
CREATE INDEX "projects_resumeId_idx" ON "projects"("resumeId");

-- CreateIndex
CREATE INDEX "certifications_resumeId_idx" ON "certifications"("resumeId");

-- CreateIndex
CREATE INDEX "awards_resumeId_idx" ON "awards"("resumeId");

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_otherFieldId_fkey" FOREIGN KEY ("otherFieldId") REFERENCES "other_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "awards" ADD CONSTRAINT "awards_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
