/*
  Warnings:

  - You are about to drop the column `stripeCancelAtPeriodEnd` on the `user_subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCurrentPeriodEnd` on the `user_subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `user_subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `stripePriceId` on the `user_subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `user_subscriptions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paystackCustomerCode]` on the table `user_subscriptions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paystackSubscriptionCode]` on the table `user_subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'TEAM');

-- CreateEnum
CREATE TYPE "AIFeature" AS ENUM ('REWRITE', 'TAILOR', 'SUGGESTIONS');

-- DropIndex
DROP INDEX "user_subscriptions_stripeCustomerId_key";

-- DropIndex
DROP INDEX "user_subscriptions_stripeSubscriptionId_key";

-- AlterTable
ALTER TABLE "user_subscriptions" DROP COLUMN "stripeCancelAtPeriodEnd",
DROP COLUMN "stripeCurrentPeriodEnd",
DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripePriceId",
DROP COLUMN "stripeSubscriptionId",
ADD COLUMN     "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3),
ADD COLUMN     "paystackCustomerCode" TEXT,
ADD COLUMN     "paystackPlanCode" TEXT,
ADD COLUMN     "paystackSubscriptionCode" TEXT,
ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "teamId" TEXT;

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feature" "AIFeature" NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usage_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "teams_ownerId_idx" ON "teams"("ownerId");

-- CreateIndex
CREATE INDEX "usage_records_userId_idx" ON "usage_records"("userId");

-- CreateIndex
CREATE INDEX "usage_records_userId_feature_idx" ON "usage_records"("userId", "feature");

-- CreateIndex
CREATE UNIQUE INDEX "usage_records_userId_feature_periodStart_key" ON "usage_records"("userId", "feature", "periodStart");

-- CreateIndex
CREATE UNIQUE INDEX "user_subscriptions_paystackCustomerCode_key" ON "user_subscriptions"("paystackCustomerCode");

-- CreateIndex
CREATE UNIQUE INDEX "user_subscriptions_paystackSubscriptionCode_key" ON "user_subscriptions"("paystackSubscriptionCode");

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
