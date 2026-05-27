/*
  Warnings:

  - The `jobTitle` column on the `resumes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "resumes" DROP COLUMN "jobTitle",
ADD COLUMN     "jobTitle" TEXT[] DEFAULT ARRAY[]::TEXT[];
