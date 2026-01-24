import { useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { Flashcard } from './Flashcard'
import type { Card } from '../types/index'

interface CardStackProps {
    cards: Card[];
    onSwipe: (cardId: string, direction: 'left' | 'right') => void;
    onEmpty?: () => void;
    isFlipped?: boolean;
    onFlip?: () => void;
}

export function CardStack({ cards, onSwipe, onEmpty, isFlipped, onFlip }: CardStackProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const currentCard = cards[currentIndex]

    const x = useMotionValue(0)
    const rotate = useTransform(x, [-200, 200], [-25, 25])
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])
    const bgOpacity = useTransform(x, [-100, 0, 100], [0.1, 0, 0.1])
    const indicatorColor = useTransform(x, [-100, 0, 100], ['#ef4444', '#94a3b8', '#10b981'])

    const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
        if (info.offset.x > 100) {
            onSwipe(currentCard.id, 'right')
            nextCard()
        } else if (info.offset.x < -100) {
            onSwipe(currentCard.id, 'left')
            nextCard()
        }
    }

    const nextCard = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1)
        } else {
            onEmpty?.()
        }
    }

    if (!currentCard) return null

    return (
        <div className="relative w-full max-w-sm mx-auto h-[500px] flex items-center justify-center">
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentCard.id}
                    style={{ x, rotate, opacity }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    className="absolute inset-0 z-10"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ x: x.get() < 0 ? -500 : 500, opacity: 0, transition: { duration: 0.3 } }}
                >
                    <Flashcard
                        content={currentCard.content}
                        isFlipped={isFlipped}
                        onFlip={onFlip}
                    />

                    {/* Action Indicators */}
                    <motion.div
                        style={{ opacity: bgOpacity, backgroundColor: indicatorColor }}
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Background Cards for depth */}
            {currentIndex < cards.length - 1 && (
                <div className="absolute inset-0 scale-95 translate-y-4 opacity-50 blur-[1px]">
                    <Flashcard content={cards[currentIndex + 1].content} />
                </div>
            )}
        </div>
    )
}
