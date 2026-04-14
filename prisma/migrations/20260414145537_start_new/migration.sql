-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'moderator', 'super_admin');

-- CreateEnum
CREATE TYPE "WordStatus" AS ENUM ('new', 'learning', 'familiar', 'mastered');

-- CreateEnum
CREATE TYPE "ReviewRating" AS ENUM ('wrong', 'hard', 'good', 'easy');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "words" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "bangla" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "part_of_speech" TEXT NOT NULL,
    "pronunciation" TEXT,
    "category" TEXT NOT NULL,
    "sentences" JSONB NOT NULL DEFAULT '[]',
    "collocations" TEXT[],
    "usage_tip" TEXT,
    "difficulty" INTEGER NOT NULL DEFAULT 5,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "word_progress" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "word_id" INTEGER NOT NULL,
    "status" "WordStatus" NOT NULL DEFAULT 'new',
    "ease_factor" REAL NOT NULL DEFAULT 2.5,
    "interval_days" REAL NOT NULL DEFAULT 0,
    "next_review_at" TIMESTAMPTZ(6),
    "streak" INTEGER NOT NULL DEFAULT 0,
    "miss_count" INTEGER NOT NULL DEFAULT 0,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "correct_count" INTEGER NOT NULL DEFAULT 0,
    "is_bookmarked" BOOLEAN NOT NULL DEFAULT false,
    "last_review_at" TIMESTAMPTZ(6),
    "introduced_at" TIMESTAMPTZ(6),

    CONSTRAINT "word_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "word_id" INTEGER NOT NULL,
    "exercise_type" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "response_time_ms" INTEGER,
    "rating" "ReviewRating" NOT NULL,
    "reviewed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_stats" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "new_words_learned" INTEGER NOT NULL DEFAULT 0,
    "reviews_completed" INTEGER NOT NULL DEFAULT 0,
    "correct_reviews" INTEGER NOT NULL DEFAULT 0,
    "time_spent_seconds" INTEGER NOT NULL DEFAULT 0,
    "streak_day" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "daily_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "user_id" UUID NOT NULL,
    "daily_new_words" INTEGER NOT NULL DEFAULT 7,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "longest_streak" INTEGER NOT NULL DEFAULT 0,
    "total_words_learned" INTEGER NOT NULL DEFAULT 0,
    "last_active_date" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "words_word_key" ON "words"("word");

-- CreateIndex
CREATE INDEX "idx_words_category" ON "words"("category");

-- CreateIndex
CREATE INDEX "idx_word_progress_next_review" ON "word_progress"("next_review_at");

-- CreateIndex
CREATE INDEX "idx_word_progress_status" ON "word_progress"("status");

-- CreateIndex
CREATE INDEX "idx_word_progress_user" ON "word_progress"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_word_progress_user_word" ON "word_progress"("user_id", "word_id");

-- CreateIndex
CREATE INDEX "idx_reviews_user_word" ON "reviews"("user_id", "word_id");

-- CreateIndex
CREATE INDEX "idx_reviews_date" ON "reviews"("reviewed_at");

-- CreateIndex
CREATE UNIQUE INDEX "idx_daily_stats_user_date" ON "daily_stats"("user_id", "date");

-- AddForeignKey
ALTER TABLE "words" ADD CONSTRAINT "words_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "word_progress" ADD CONSTRAINT "word_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "word_progress" ADD CONSTRAINT "word_progress_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_stats" ADD CONSTRAINT "daily_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
