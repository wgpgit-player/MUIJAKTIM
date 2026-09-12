-- AlterTable
ALTER TABLE "bidang_komisi" ADD COLUMN     "secretary_name" TEXT;

-- AlterTable
ALTER TABLE "faq_tanya_ulama" ADD COLUMN     "keywords" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "fatwa" ADD COLUMN     "pdf_url" TEXT,
ADD COLUMN     "published_at" TIMESTAMP(3);
