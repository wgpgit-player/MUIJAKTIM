-- CreateEnum
CREATE TYPE "NewsSection" AS ENUM ('KABAR_JAKARTA_TIMUR', 'OPINI_ULAMA', 'RILIS_PERS');

-- CreateEnum
CREATE TYPE "ArticleSection" AS ENUM ('DOA_DZIKIR', 'HIKMAH_AKHLAK', 'KHUTBAH_JUMAT', 'FIQIH_WANITA', 'PARENTING', 'KITAB_KAMUS', 'KITAB_TURATS');

-- AlterTable
ALTER TABLE "news" ADD COLUMN     "section" "NewsSection" NOT NULL DEFAULT 'KABAR_JAKARTA_TIMUR';

-- CreateTable
CREATE TABLE "page_content" (
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "updated_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_content_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" UUID NOT NULL,
    "section" "ArticleSection" NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "body" TEXT NOT NULL,
    "extra" JSONB NOT NULL DEFAULT '{}',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "articles_section_slug_key" ON "articles"("section", "slug");

-- AddForeignKey
ALTER TABLE "page_content" ADD CONSTRAINT "page_content_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
