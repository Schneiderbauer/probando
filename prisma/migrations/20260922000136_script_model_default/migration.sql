-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Script" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "funnelStage" TEXT NOT NULL,
    "angle" TEXT NOT NULL,
    "hook" TEXT NOT NULL,
    "development" TEXT NOT NULL,
    "cta" TEXT NOT NULL,
    "fullText" TEXT NOT NULL,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "variantNo" INTEGER NOT NULL DEFAULT 1,
    "model" TEXT NOT NULL DEFAULT 'claude-opus-5',
    "competitorVideoId" TEXT,
    "clientId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Script_competitorVideoId_fkey" FOREIGN KEY ("competitorVideoId") REFERENCES "CompetitorVideo" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Script_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Script" ("angle", "clientId", "competitorVideoId", "createdAt", "cta", "development", "favorite", "fullText", "funnelStage", "hook", "id", "model", "variantNo") SELECT "angle", "clientId", "competitorVideoId", "createdAt", "cta", "development", "favorite", "fullText", "funnelStage", "hook", "id", "model", "variantNo" FROM "Script";
DROP TABLE "Script";
ALTER TABLE "new_Script" RENAME TO "Script";
CREATE INDEX "Script_funnelStage_idx" ON "Script"("funnelStage");
CREATE INDEX "Script_favorite_idx" ON "Script"("favorite");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
