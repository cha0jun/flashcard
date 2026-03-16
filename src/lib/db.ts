import { supabase } from './supabase'
import type { Deck, Card, CardSRSMetadata, ReviewLog } from '../types/index'

// ─── Decks ────────────────────────────────────────────────────────────────────

export async function fetchDecks(userId: string): Promise<Deck[]> {
    const { data, error } = await supabase
        .from('decks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
}

export async function createDeck(
    userId: string,
    title: string,
    description: string | null
): Promise<Deck> {
    const { data, error } = await supabase
        .from('decks')
        .insert({ user_id: userId, title, description })
        .select()
        .single()
    if (error) throw error
    return data
}

// ─── Cards ────────────────────────────────────────────────────────────────────

export async function fetchCards(deckId: string): Promise<Card[]> {
    const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('deck_id', deckId)
        .order('created_at', { ascending: true })
    if (error) throw error
    return data ?? []
}

export async function fetchCardCounts(deckIds: string[]): Promise<Record<string, number>> {
    if (deckIds.length === 0) return {}
    const { data, error } = await supabase
        .from('cards')
        .select('deck_id')
        .in('deck_id', deckIds)
    if (error) throw error
    return (data ?? []).reduce<Record<string, number>>((acc, row) => {
        acc[row.deck_id] = (acc[row.deck_id] ?? 0) + 1
        return acc
    }, {})
}

export async function fetchAllUserCards(userId: string): Promise<Card[]> {
    const decks = await fetchDecks(userId)
    if (decks.length === 0) return []
    const deckIds = decks.map(d => d.id)
    const { data, error } = await supabase
        .from('cards')
        .select('*')
        .in('deck_id', deckIds)
    if (error) throw error
    return data ?? []
}

// ─── SRS Metadata ─────────────────────────────────────────────────────────────

export async function upsertSRSMetadata(meta: CardSRSMetadata): Promise<void> {
    const { error } = await supabase
        .from('card_srs_metadata')
        .upsert(meta, { onConflict: 'card_id' })
    if (error) throw error
}

// ─── Review Logs ──────────────────────────────────────────────────────────────

export async function insertReviewLog(
    log: Omit<ReviewLog, 'id' | 'reviewed_at'>,
    userId: string
): Promise<void> {
    const { error } = await supabase
        .from('review_logs')
        .insert({ ...log, user_id: userId, reviewed_at: new Date().toISOString() })
    if (error) throw error
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function fetchDashboardStats(userId: string) {
    const decks = await fetchDecks(userId)
    const deckIds = decks.map(d => d.id)

    const [cardCountRes, reviewRes] = await Promise.all([
        deckIds.length > 0
            ? supabase
                .from('cards')
                .select('id', { count: 'exact', head: true })
                .in('deck_id', deckIds)
            : Promise.resolve({ count: 0, error: null }),
        supabase
            .from('review_logs')
            .select('reviewed_at')
            .eq('user_id', userId)
            .order('reviewed_at', { ascending: false }),
    ])

    const cardCount = cardCountRes.count ?? 0
    const streak = computeStreak(reviewRes.data ?? [])

    // Cards due today: count cards whose next_review_at <= now
    let dueCount = 0
    if (deckIds.length > 0) {
        const { count } = await supabase
            .from('card_srs_metadata')
            .select('card_id', { count: 'exact', head: true })
            .in('card_id',
                (await supabase.from('cards').select('id').in('deck_id', deckIds)).data?.map(c => c.id) ?? []
            )
            .lte('next_review_at', new Date().toISOString())
        dueCount = count ?? 0
    }

    return {
        deckCount: decks.length,
        cardCount,
        streak,
        dueCount,
    }
}

function computeStreak(logs: { reviewed_at: string }[]): number {
    if (logs.length === 0) return 0

    const days = new Set(logs.map(l => l.reviewed_at.slice(0, 10)))
    const dayArray = Array.from(days).sort().reverse()

    const today = new Date().toISOString().slice(0, 10)
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

    if (dayArray[0] !== today && dayArray[0] !== yesterday) return 0

    let streak = 1
    for (let i = 1; i < dayArray.length; i++) {
        const prev = new Date(dayArray[i - 1])
        const curr = new Date(dayArray[i])
        const diffDays = (prev.getTime() - curr.getTime()) / 86400000
        if (diffDays === 1) streak++
        else break
    }
    return streak
}
