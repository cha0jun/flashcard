import { createFileRoute } from '@tanstack/react-router'
import { GenerationForm } from '../components/GenerationForm'
import type { SourceType } from '../types/index'
import { Sparkles } from 'lucide-react'

export const Route = createFileRoute('/create')({
    component: CreateDeck,
})

function CreateDeck() {
    const handleGenerate = (data: { type: SourceType; content: string | File }) => {
        console.log('Generating deck with:', data)
        // Integration logic will follow
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

            <GenerationForm onGenerate={handleGenerate} />
        </div>
    )
}
