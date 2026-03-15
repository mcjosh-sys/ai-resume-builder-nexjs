/*
  Warnings:

  - A unique constraint covering the columns `[otherFieldId]` on the table `section_orders` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "section_orders_resumeId_sectionType_key";

-- AlterTable
ALTER TABLE "section_orders" ADD COLUMN     "otherFieldId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "section_orders_otherFieldId_key" ON "section_orders"("otherFieldId");

-- AddForeignKey
ALTER TABLE "section_orders" ADD CONSTRAINT "section_orders_otherFieldId_fkey" FOREIGN KEY ("otherFieldId") REFERENCES "other_fields"("id") ON DELETE SET NULL ON UPDATE CASCADE;
