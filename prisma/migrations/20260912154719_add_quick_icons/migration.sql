-- CreateTable
CREATE TABLE "quick_icons" (
    "id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "icon_url" TEXT NOT NULL,
    "link_url" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "show_on_desktop" BOOLEAN NOT NULL DEFAULT true,
    "show_on_mobile" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updated_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quick_icons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "quick_icons" ADD CONSTRAINT "quick_icons_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
