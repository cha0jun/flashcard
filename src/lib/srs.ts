import type { CardSRSMetadata } from '../types/index'

type Rating = 1 | 2 | 3 | 4

/**
 * Simplified SM-2 algorithm.
 * Returns new SRS metadata to upsert after a card review.
 */
export function computeNextSRS(
    prev: CardSRSMetadata | null,
    cardId: string,
    rating: Rating
): CardSRSMetadata {
    const ef = prev?.ease_factor ?? 2.5
    const interval = prev?.interval_days ?? 1
    const reps = prev?.repetitions ?? 0

    // Adjust ease factor based on rating (5 = perfect, scaled to our 1-4)
    // Map: 1=0, 2=2, 3=3, 4=5 on SM-2 scale
    const sm2Rating = [0, 2, 3, 5][rating - 1]
    let newEf = ef + (0.1 - (5 - sm2Rating) * (0.08 + (5 - sm2Rating) * 0.02))
    newEf = Math.max(1.3, Math.min(2.5, newEf))

    let newReps: number
    let newInterval: number

    if (rating >= 3) {
        // Good or Easy: advance the interval
        newReps = reps + 1
        if (reps === 0) newInterval = 1
        else if (reps === 1) newInterval = 6
        else newInterval = Math.round(interval * ef)
        // Easy gets a bonus multiplier
        if (rating === 4) newInterval = Math.round(newInterval * 1.3)
    } else {
        // Again or Hard: reset
        newReps = 0
        newInterval = rating === 2 ? Math.max(1, Math.round(interval * 0.5)) : 1
    }

    const nextReview = new Date(Date.now() + newInterval * 86400000).toISOString()

    return {
        card_id: cardId,
        ease_factor: newEf,
        interval_days: newInterval,
        repetitions: newReps,
        next_review_at: nextReview,
    }
}
