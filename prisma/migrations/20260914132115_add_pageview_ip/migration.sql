-- AlterTable
ALTER TABLE "page_views" ADD COLUMN     "ip" TEXT;

-- CreateIndex
CREATE INDEX "page_views_ip_idx" ON "page_views"("ip");
