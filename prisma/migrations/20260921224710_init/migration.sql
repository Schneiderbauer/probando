-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "industry" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CompetitorVideo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL DEFAULT 'OTHER',
    "url" TEXT,
    "title" TEXT NOT NULL,
    "authorHandle" TEXT,
    "niche" TEXT NOT NULL,
    "painPoints" TEXT NOT NULL,
    "transcript" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "notes" TEXT,
    "metrics" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Script" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "funnelStage" TEXT NOT NULL,
    "angle" TEXT NOT NULL,
    "hook" TEXT NOT NULL,
    "development" TEXT NOT NULL,
    "cta" TEXT NOT NULL,
    "fullText" TEXT NOT NULL,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "variantNo" INTEGER NOT NULL DEFAULT 1,
    "model" TEXT NOT NULL DEFAULT 'template-engine',
    "competitorVideoId" TEXT,
    "clientId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Script_competitorVideoId_fkey" FOREIGN KEY ("competitorVideoId") REFERENCES "CompetitorVideo" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Script_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Client_name_idx" ON "Client"("name");

-- CreateIndex
CREATE INDEX "CompetitorVideo_niche_idx" ON "CompetitorVideo"("niche");

-- CreateIndex
CREATE INDEX "CompetitorVideo_createdAt_idx" ON "CompetitorVideo"("createdAt");

-- CreateIndex
CREATE INDEX "Script_funnelStage_idx" ON "Script"("funnelStage");

-- CreateIndex
CREATE INDEX "Script_favorite_idx" ON "Script"("favorite");
