import { useState } from 'react'
import { motion } from 'framer-motion'
import type { CardContent } from '../types/index'

interface FlashcardProps {
    content: CardContent;
    isFlipped?: boolean;
    onFlip?: () => void;
}

export function Flashcard({ content, isFlipped: controlledFlipped, onFlip }: FlashcardProps) {
    const [internalFlipped, setInternalFlipped] = useState(false)
    const isFlipped = controlledFlipped !== undefined ? controlledFlipped : internalFlipped

    const handleFlip = () => {
        if (onFlip) {
            onFlip()
        } else {
            setInternalFlipped(!internalFlipped)
        }
    }

    return (
        <div
            className="relative w-full aspect-[3/4] cursor-pointer perspective-1000"
            onClick={handleFlip}
        >
            <motion.div
                className="w-full h-full relative preserve-3d transition-transform duration-500"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
                {/* Front */}
                <div className="absolute inset-0 w-full h-full backface-hidden p-8 bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-4">Question</span>
                    <h2 className="text-2xl font-semibold text-slate-800 leading-relaxed">
                        {content.front}
                    </h2>
                    {content.hint && (
                        <p className="mt-6 text-sm text-slate-400 italic">Hint: {content.hint}</p>
                    )}
                </div>

                {/* Back */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden p-8 bg-brand-50 rounded-2xl border border-brand-200 shadow-xl flex flex-col items-center justify-center text-center"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-4">Answer</span>
                    <h2 className="text-2xl font-semibold text-slate-800 leading-relaxed">
                        {content.back}
                    </h2>
                    {content.explanation && (
                        <div className="mt-6 p-4 bg-white/50 rounded-lg text-left">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Explanation</p>
                            <p className="text-sm text-slate-600">{content.explanation}</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
