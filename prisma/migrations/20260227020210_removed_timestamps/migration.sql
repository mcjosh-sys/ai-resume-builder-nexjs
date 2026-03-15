/*
  Warnings:

  - You are about to drop the column `createdAt` on the `educations` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `educations` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `links` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `links` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `other_fields` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `other_fields` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `section_orders` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `section_orders` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `skills` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `skills` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `work_experiences` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `work_experiences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "educations" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "links" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "other_fields" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "section_orders" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "skills" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "work_experiences" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
