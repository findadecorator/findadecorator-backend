const reviews: Array<{
  id: string;
  jobId: string;
  bookingId: string;
  reviewerId: string;
  rating: number;
  body: string;
  verifiedJob: boolean;
  fraudSignals: string[];
  moderationStatus: "pending" | "approved" | "hidden";
}> = [];

const appeals: Array<{ id: string; reviewId: string; appellantId: string; reason: string; status: "open" | "closed" }> = [];

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function listReviews() {
  return reviews;
}

export function createReview(input: { jobId: string; bookingId: string; reviewerId: string; rating: number; body: string }) {
  const fraudSignals: string[] = [];
  if (input.rating === 5 && /money back|cash only|outside platform/i.test(input.body)) {
    fraudSignals.push("suspicious-keywords");
  }
  const review = {
    id: makeId("review"),
    ...input,
    verifiedJob: true,
    fraudSignals,
    moderationStatus: "pending" as const
  };
  reviews.push(review);
  return review;
}

export function moderateReview(reviewId: string, action: "approve" | "hide" | "flag") {
  const review = reviews.find((item) => item.id === reviewId);
  if (!review) return null;
  if (action === "approve") review.moderationStatus = "approved";
  if (action === "hide") review.moderationStatus = "hidden";
  if (action === "flag") review.fraudSignals.push("manual-flag");
  return review;
}

export function createAppeal(input: { reviewId: string; appellantId: string; reason: string }) {
  const appeal = { id: makeId("appeal"), ...input, status: "open" as const };
  appeals.push(appeal);
  return appeal;
}

export function listAppeals() {
  return appeals;
}

