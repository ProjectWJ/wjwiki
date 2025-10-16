-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('THUMBNAIL', 'MEDIUM', 'ORIGINAL');

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "height" INTEGER,
ADD COLUMN     "order" INTEGER,
ADD COLUMN     "post_id" INTEGER,
ADD COLUMN     "type" "MediaType",
ADD COLUMN     "width" INTEGER;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
