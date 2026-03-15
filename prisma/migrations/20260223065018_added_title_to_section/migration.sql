/*
  Warnings:

  - You are about to drop the column `iconId` on the `other_fields` table. All the data in the column will be lost.
  - Added the required column `title` to the `section_orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "other_fields" DROP COLUMN "iconId";

-- AlterTable
ALTER TABLE "section_orders" ADD COLUMN     "icon" TEXT NOT NULL DEFAULT 'star',
ADD COLUMN     "title" TEXT NOT NULL;
