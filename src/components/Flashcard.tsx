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
            className="relative w-full h-full cursor-pointer perspective-1000 group rounded-3xl"
            onClick={handleFlip}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleFlip();
                }
            }}
            tabIndex={0}
            role="button"
            aria-label={isFlipped ? "Answer side of flashcard. Press space to flip." : "Question side of flashcard. Press space to flip."}
        >
            <motion.div
                className="w-full h-full relative preserve-3d transition-transform duration-500 rounded-3xl"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
                {/* Front (Question) */}
                <div className="absolute inset-0 w-full h-full backface-hidden p-8 bg-white border border-paper-200 rounded-3xl flex flex-col justify-center text-center shadow-sm">
                     <div className="absolute top-6 left-6 text-ink-300 font-semibold text-xs tracking-widest uppercase bg-paper-50 px-3 py-1 rounded-full">Question</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-ink-900 leading-tight">
                        {content.front}
                    </h2>
                    {content.hint && (
                        <p className="mt-8 text-sm font-medium text-brand-600 bg-brand-50 px-4 py-2 rounded-xl inline-block mx-auto border border-brand-100">
                             💡 {content.hint}
                        </p>
                    )}
                </div>

                {/* Back (Answer) */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden p-8 bg-brand-50 border border-brand-100 rounded-3xl flex flex-col text-left overflow-y-auto shadow-inner"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                     <div className="absolute top-6 left-6 text-brand-500 font-semibold text-xs tracking-widest uppercase bg-white border border-brand-100 px-3 py-1 rounded-full shadow-sm">Answer</div>
                    <div className="flex-1 flex flex-col justify-center mt-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-ink-900 leading-tight">
                            {content.back}
                        </h2>
                        {content.explanation && (
                            <div className="mt-8">
                                <p className="text-xs font-semibold text-brand-600/80 uppercase mb-2 tracking-wide">Explanation</p>
                                <p className="text-sm md:text-base text-ink-500 leading-relaxed bg-white/60 p-5 rounded-2xl border border-white backdrop-blur-sm">{content.explanation}</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
