-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('PENDING', 'USED', 'SCHEDULED_FOR_DELETION');

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "blob_url" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "uploaded_by" TEXT,
    "status" "MediaStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "scheduled_delete_at" TIMESTAMP(3),

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_blob_url_key" ON "Media"("blob_url");
