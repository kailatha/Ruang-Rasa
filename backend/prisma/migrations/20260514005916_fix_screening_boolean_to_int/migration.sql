/*
  Warnings:

  - Changed the type of `social_media` on the `ScreeningResult` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `trauma_history` on the `ScreeningResult` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `previously_diagnosed` on the `ScreeningResult` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `mood_swings` on the `ScreeningResult` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `loneliness` on the `ScreeningResult` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ScreeningResult" DROP COLUMN "social_media",
ADD COLUMN     "social_media" INTEGER NOT NULL,
DROP COLUMN "trauma_history",
ADD COLUMN     "trauma_history" INTEGER NOT NULL,
DROP COLUMN "previously_diagnosed",
ADD COLUMN     "previously_diagnosed" INTEGER NOT NULL,
DROP COLUMN "mood_swings",
ADD COLUMN     "mood_swings" INTEGER NOT NULL,
DROP COLUMN "loneliness",
ADD COLUMN     "loneliness" INTEGER NOT NULL;
