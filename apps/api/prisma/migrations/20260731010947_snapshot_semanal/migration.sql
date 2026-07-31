-- CreateTable
CREATE TABLE "GameSeason" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "patch" TEXT,
    "firstPeriod" INTEGER NOT NULL,
    "periodCount" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameSeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterSnapshot" (
    "id" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "nameKey" TEXT NOT NULL,
    "realmSlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "itemLevel" DOUBLE PRECISION,
    "mythicPlusScore" DOUBLE PRECISION,
    "keysDone" INTEGER,
    "highestKey" INTEGER,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CharacterSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CharacterSnapshot_seasonId_idx" ON "CharacterSnapshot"("seasonId");

-- CreateIndex
CREATE INDEX "CharacterSnapshot_realmSlug_nameKey_idx" ON "CharacterSnapshot"("realmSlug", "nameKey");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterSnapshot_period_realmSlug_nameKey_key" ON "CharacterSnapshot"("period", "realmSlug", "nameKey");

-- AddForeignKey
ALTER TABLE "CharacterSnapshot" ADD CONSTRAINT "CharacterSnapshot_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "GameSeason"("id") ON DELETE CASCADE ON UPDATE CASCADE;
