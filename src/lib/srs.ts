// Ported verbatim from VocabMind/src/lib/srs.ts — pure SM-2-like spacing.

export type Rating = "wrong" | "hard" | "good" | "easy";
export type WordStatus = "new" | "learning" | "familiar" | "mastered";

export interface SRSInput {
  easeFactor: number;
  intervalDays: number;
  streak: number;
  missCount: number;
  status: WordStatus;
  isBookmarked: boolean;
}

export interface SRSResult {
  easeFactor: number;
  intervalDays: number;
  streak: number;
  missCount: number;
  status: WordStatus;
  nextReviewAt: Date;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + Math.round(days));
  return result;
}

export function calculateNextReview(current: SRSInput, rating: Rating): SRSResult {
  let { easeFactor, intervalDays, streak, missCount, status } = current;

  switch (rating) {
    case "wrong":
      intervalDays = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      streak = 0;
      missCount += 1;
      status = "learning";
      break;

    case "hard":
      intervalDays = Math.max(1, intervalDays * 1.2);
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      streak += 1;
      break;

    case "good":
      if (intervalDays === 0) intervalDays = 1;
      else if (intervalDays === 1) intervalDays = 3;
      else intervalDays = intervalDays * easeFactor;
      streak += 1;
      break;

    case "easy":
      if (intervalDays === 0) intervalDays = 3;
      else intervalDays = intervalDays * easeFactor * 1.3;
      easeFactor += 0.15;
      streak += 1;
      break;
  }

  if (rating !== "wrong") {
    if (intervalDays >= 30) status = "mastered";
    else if (intervalDays >= 7) status = "familiar";
    else if (intervalDays >= 1) status = "learning";
  }

  if (current.isBookmarked && intervalDays > 7) {
    intervalDays = 7;
  }

  const nextReviewAt = addDays(new Date(), intervalDays);
  return { easeFactor, intervalDays, streak, missCount, status, nextReviewAt };
}

export function getExerciseTypesForStatus(status: WordStatus): string[] {
  switch (status) {
    case "new":
      return ["mcq_bangla", "mcq_fill"];
    case "learning":
      return ["listen_speak", "recall_bangla"];
    case "familiar":
      return ["type_word", "speak_sentence"];
    case "mastered":
      return ["speak_sentence"];
    default:
      return ["mcq_bangla", "mcq_fill"];
  }
}
