import type { CardSrsMetadata } from '$lib/types/database';

const MIN_EASE = 1.3;
const MAX_EASE = 2.5;

/**
 * SM-2 algorithm: compute next SRS metadata after a review.
 * Rating: 1=Again, 2=Hard, 3=Good, 4=Easy
 */
export function computeNextReview(
	current: CardSrsMetadata,
	rating: number
): Pick<CardSrsMetadata, 'ease_factor' | 'interval_days' | 'repetitions' | 'next_review_at'> {
	let { ease_factor, interval_days, repetitions } = current;

	if (rating === 1) {
		// Reset on failure
		repetitions = 0;
		interval_days = 1;
	} else {
		repetitions += 1;
		if (repetitions === 1) {
			interval_days = 1;
		} else if (repetitions === 2) {
			interval_days = 6;
		} else {
			interval_days = Math.round(interval_days * ease_factor);
		}
	}

	// Adjust ease factor based on rating
	ease_factor = ease_factor + (0.1 - (4 - rating) * (0.08 + (4 - rating) * 0.02));
	ease_factor = Math.max(MIN_EASE, Math.min(MAX_EASE, ease_factor));

	const next = new Date();
	next.setDate(next.getDate() + interval_days);

	return {
		ease_factor,
		interval_days,
		repetitions,
		next_review_at: next.toISOString()
	};
}
