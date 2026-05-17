-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScreeningResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sleep_hours" INTEGER NOT NULL,
    "screen_time" INTEGER NOT NULL,
    "social_media" BOOLEAN NOT NULL,
    "trauma_history" BOOLEAN NOT NULL,
    "previously_diagnosed" BOOLEAN NOT NULL,
    "work_hours" INTEGER NOT NULL,
    "work_stress" INTEGER NOT NULL,
    "financial_stress" INTEGER NOT NULL,
    "mood_swings" BOOLEAN NOT NULL,
    "loneliness" BOOLEAN NOT NULL,
    "total_score" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScreeningResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreeningResult" ADD CONSTRAINT "ScreeningResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
