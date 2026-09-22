-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "registrationOpen" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- Seed the singleton settings row
INSERT INTO "SiteSettings" ("id", "registrationOpen") VALUES ('global', true)
ON CONFLICT ("id") DO NOTHING;
