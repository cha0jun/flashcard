import type { Deck, Card } from '../types/index';

export const MOCK_DECKS: Deck[] = [
    {
        id: 'deck-1',
        user_id: 'user-2',
        title: 'React Fundamentals',
        description: 'Core concepts of React.js including hooks, components, and state management.',
        created_at: new Date().toISOString(),
    },
    {
        id: 'deck-2',
        user_id: 'user-2',
        title: 'TypeScript Masterclass',
        description: 'Advanced TypeScript features, utility types, and generic programming.',
        created_at: new Date().toISOString(),
    }
];

export const MOCK_CARDS: Card[] = [
    // React Fundamentals Cards
    {
        id: 'card-1',
        deck_id: 'deck-1',
        gen_job_id: null,
        content: {
            front: 'What is the purpose of useEffect?',
            back: 'To perform side effects in functional components.',
            hint: 'Think about lifecycle methods in class components.',
            explanation: 'useEffect allows you to handle things like data fetching, subscriptions, or manually changing the DOM. It runs after every render by default, but can be optimized with a dependency array.'
        },
        is_user_edited: false,
        is_flagged: false,
        created_at: new Date().toISOString(),
    },
    {
        id: 'card-2',
        deck_id: 'deck-1',
        gen_job_id: null,
        content: {
            front: 'What are the rules of hooks?',
            back: 'Only call hooks at the top level and only from React functions.',
            hint: 'Top level and React functions.',
            explanation: 'Hooks must be called at the top level of your React function (not inside loops, conditions, or nested functions) and only from React functional components or custom hooks.'
        },
        is_user_edited: false,
        is_flagged: false,
        created_at: new Date().toISOString(),
    },
    {
        id: 'card-3',
        deck_id: 'deck-1',
        gen_job_id: null,
        content: {
            front: 'What is the Virtual DOM?',
            back: 'A lightweight copy of the real DOM used for reconciliation.',
            hint: 'Reconciliation process.',
            explanation: 'React creates a virtual representation of the UI in memory. When state changes, it compares the new virtual DOM with the previous one (diffing) and updates only the necessary parts of the real DOM.'
        },
        is_user_edited: false,
        is_flagged: false,
        created_at: new Date().toISOString(),
    },

    // TypeScript Masterclass Cards
    {
        id: 'card-4',
        deck_id: 'deck-2',
        gen_job_id: null,
        content: {
            front: 'What does the "Partial<T>" utility type do?',
            back: 'Makes all properties in T optional.',
            hint: 'Optional properties.',
            explanation: 'Partial<T> constructs a type with all properties of T set to optional. This is useful when you want to update only a subset of an object\'s properties.'
        },
        is_user_edited: false,
        is_flagged: false,
        created_at: new Date().toISOString(),
    },
    {
        id: 'card-5',
        deck_id: 'deck-2',
        gen_job_id: null,
        content: {
            front: 'What is an "Unknown" type?',
            back: 'A type-safe version of "any".',
            hint: 'Type safety.',
            explanation: 'The "unknown" type represents any value, but unlike "any", you cannot perform any operations on a value of type "unknown" without first narrowing its type through type guards or assertions.'
        },
        is_user_edited: false,
        is_flagged: false,
        created_at: new Date().toISOString(),
    }
];
