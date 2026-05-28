-- AlterTable
ALTER TABLE "Journal" ADD COLUMN     "analysis" JSONB,
ADD COLUMN     "confidence" DOUBLE PRECISION,
ADD COLUMN     "emotion" TEXT,
ADD COLUMN     "sentiment_label" TEXT,
ADD COLUMN     "sentiment_score" DOUBLE PRECISION;
