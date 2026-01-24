export type CardContent = {
    front: string;
    back: string;
    hint: string;
    explanation: string;
};

export type SourceType = 'TEXT' | 'PDF' | 'URL' | 'TOPIC';

export interface SourceMaterial {
    id: string;
    user_id: string;
    type: SourceType;
    raw_content: string;
    metadata: Record<string, unknown>;
}

export interface Deck {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    created_at?: string;
}

export interface Card {
    id: string;
    deck_id: string;
    gen_job_id: string | null;
    content: CardContent;
    is_user_edited: boolean;
    is_flagged: boolean;
    created_at?: string;
}

export interface CardSRSMetadata {
    card_id: string;
    ease_factor: number;
    interval_days: number;
    repetitions: number;
    next_review_at: string;
}

export interface ReviewLog {
    id: string;
    card_id: string;
    rating: 1 | 2 | 3 | 4; // Again, Hard, Good, Easy
    response_time_ms: number;
    reviewed_at: string;
}

export interface LLMGenJob {
    id: string;
    source_id: string;
    model_name: string;
    prompt_version: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    error_log: string | null;
}
