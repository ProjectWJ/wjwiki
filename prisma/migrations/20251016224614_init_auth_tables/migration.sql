/*
  Warnings:

  - A unique constraint covering the columns `[medium_url]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[thumbnail_url]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - Made the column `medium_url` on table `Media` required. This step will fail if there are existing NULL values in that column.
  - Made the column `thumbnail_url` on table `Media` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Media" ALTER COLUMN "medium_url" SET NOT NULL,
ALTER COLUMN "thumbnail_url" SET NOT NULL;

-- DropEnum
DROP TYPE "public"."MediaType";

-- CreateIndex
CREATE UNIQUE INDEX "Media_medium_url_key" ON "Media"("medium_url");

-- CreateIndex
CREATE UNIQUE INDEX "Media_thumbnail_url_key" ON "Media"("thumbnail_url");
