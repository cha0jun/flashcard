import { createFileRoute } from '@tanstack/react-router'
import { GenerationForm } from '../components/GenerationForm'
import type { SourceType } from '../types/index'

export const Route = createFileRoute('/create')({
    component: CreateDeck,
})

function CreateDeck() {
    const handleGenerate = (data: { type: SourceType; content: string | File }) => {
        console.log('Generating deck with:', data)
        // Integration logic will follow
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <header className="text-center">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create New Deck</h1>
                <p className="text-slate-500 mt-2">Transform your learning material into active recall cards instantly.</p>
            </header>

            <GenerationForm onGenerate={handleGenerate} />
        </div>
    )
}
