/*
  Warnings:

  - You are about to drop the column `content` on the `summaries` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `summaries` table. All the data in the column will be lost.
  - You are about to drop the column `minRead` on the `summaries` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `summaries` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `summaries` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `summaries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `summaries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "summaries" DROP COLUMN "content",
DROP COLUMN "createdAt",
DROP COLUMN "minRead",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "key_takeaway" TEXT,
ADD COLUMN     "min_read" INTEGER,
ADD COLUMN     "overview" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "slides" (
    "id" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "summary_id" TEXT NOT NULL,

    CONSTRAINT "slides_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "slides" ADD CONSTRAINT "slides_summary_id_fkey" FOREIGN KEY ("summary_id") REFERENCES "summaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
