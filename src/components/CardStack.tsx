
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

interface DraggableCardProps {
    card: Card;
    onSwipe: (cardId: string, direction: 'left' | 'right') => void;
    isFlipped?: boolean;
    onFlip?: () => void;
}

function DraggableCard({ card, onSwipe, isFlipped, onFlip }: DraggableCardProps) {
    const x = useMotionValue(0)
    const rotate = useTransform(x, [-200, 200], [-10, 10])
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])
    const bgOpacity = useTransform(x, [-100, 0, 100], [0.15, 0, 0.15])
    const indicatorColor = useTransform(x, [-100, 0, 100], ['#ef4444', 'transparent', '#22c55e'])

    const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
        if (info.offset.x > 100) {
            onSwipe(card.id, 'right')
        } else if (info.offset.x < -100) {
            onSwipe(card.id, 'left')
        }
    }

    return (
        <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing shadow-lg rounded-3xl"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ x: x.get() < 0 ? -300 : 300, opacity: 0, transition: { duration: 0.2, ease: "easeOut" } }}
        >
            <div className="relative h-full w-full rounded-3xl overflow-hidden">
                <Flashcard
                    content={card.content}
                    isFlipped={isFlipped}
                    onFlip={onFlip}
                />

                {/* Action Indicators - Overlay on top of card */}
                <motion.div
                    style={{ opacity: bgOpacity, backgroundColor: indicatorColor }}
                    className="absolute inset-0 pointer-events-none mix-blend-multiply transition-colors duration-75 rounded-3xl"
                />
                
                {/* Swipe Icons */}
                <motion.div
                    style={{ opacity: useTransform(x, [50, 150], [0, 1]) }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg pointer-events-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </motion.div>
                <motion.div
                    style={{ opacity: useTransform(x, [-50, -150], [0, 1]) }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg pointer-events-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                </motion.div>
            </div>
        </motion.div>
    )
}

export function CardStack({ cards, onSwipe, isFlipped, onFlip }: CardStackProps) {
    const currentCard = cards[0]

    if (!currentCard) return null

    return (
        <div className="relative w-full max-w-sm mx-auto aspect-[3/4] max-h-[65dvh] flex items-center justify-center perspective-1000">
            {/* Background Cards for depth */}
            {cards.length > 2 && (
                <div className="absolute inset-0 scale-[0.92] translate-y-6 bg-white border border-paper-200 rounded-3xl shadow-sm"></div>
            )}
            {cards.length > 1 && (
                <div className="absolute inset-0 scale-[0.96] translate-y-3 bg-white border border-paper-200 rounded-3xl shadow-md"></div>
            )}

            <AnimatePresence mode="popLayout">
                <DraggableCard
                    key={currentCard.id}
                    card={currentCard}
                    onSwipe={onSwipe}
                    isFlipped={isFlipped}
                    onFlip={onFlip}
                />
            </AnimatePresence>
        </div>
    )
}
