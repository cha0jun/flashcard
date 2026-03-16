import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { GenerationForm } from '../components/GenerationForm'
import { createDeck } from '../lib/db'
import { supabase } from '../lib/supabase'
import type { SourceType } from '../types/index'
import { Sparkles } from 'lucide-react'

export const Route = createFileRoute('/create')({
    component: CreateDeck,
})

function CreateDeck() {
    const navigate = useNavigate()
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleGenerate = async (data: { type: SourceType; title: string; content: string | File }) => {
        setIsProcessing(true)
        setError(null)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const description = data.type === 'TOPIC'
                ? (data.content as string)
                : `Generated from PDF: ${(data.content as File).name}`

            await createDeck(user.id, data.title, description)
            navigate({ to: '/decks' })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create deck')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 mt-4">
            <header className="text-center mb-10">
                <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-100">
                    <Sparkles className="w-8 h-8 text-brand-500" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-ink-900">Create New Deck</h1>
                <p className="text-ink-400 mt-2 text-sm max-w-sm mx-auto">Upload a document or provide a topic and our AI will extract key concepts into a study deck.</p>
            </header>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    {error}
                </div>
            )}

            <GenerationForm onGenerate={handleGenerate} isProcessing={isProcessing} />
        </div>
    )
}
