-- AlterEnum
ALTER TYPE "SectionType" ADD VALUE 'HEADER';

-- DropForeignKey
ALTER TABLE "section_orders" DROP CONSTRAINT "section_orders_otherFieldId_fkey";

-- AddForeignKey
ALTER TABLE "section_orders" ADD CONSTRAINT "section_orders_otherFieldId_fkey" FOREIGN KEY ("otherFieldId") REFERENCES "other_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
