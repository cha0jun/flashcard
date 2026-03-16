import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Type, Upload, ChevronRight, Loader2 } from 'lucide-react'
import type { SourceType } from '../types/index'

interface GenerationFormProps {
    onGenerate: (data: { type: SourceType; title: string; content: string | File }) => void;
    isProcessing?: boolean;
}

export function GenerationForm({ onGenerate, isProcessing }: GenerationFormProps) {
    const [step, setStep] = useState(1)
    const [type, setType] = useState<SourceType | null>(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [file, setFile] = useState<File | null>(null)

    const canProceedStep2 = title.trim().length > 0 && (type === 'PDF' ? !!file : content.trim().length > 0)

    const handleNext = () => {
        if (step === 1 && type) {
            setStep(2)
        } else if (step === 2 && canProceedStep2) {
            onGenerate({ type: type!, title: title.trim(), content: type === 'PDF' ? file! : content })
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8">
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-slate-900">Choose your source</h2>
                                <p className="text-slate-500 text-sm mt-1">How would you like to generate your cards?</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setType('TOPIC')}
                                    className={`p-6 rounded-xl border-2 transition-all text-left ${type === 'TOPIC' ? 'border-brand-500 bg-brand-50' : 'border-slate-100 hover:border-slate-200'
                                        }`}
                                >
                                    <Type className={`w-8 h-8 mb-4 ${type === 'TOPIC' ? 'text-brand-600' : 'text-slate-400'}`} />
                                    <h3 className="font-bold text-slate-800">Topic or Concept</h3>
                                    <p className="text-xs text-slate-500 mt-1">Generate cards from a short description or keyword.</p>
                                </button>

                                <button
                                    onClick={() => setType('PDF')}
                                    className={`p-6 rounded-xl border-2 transition-all text-left ${type === 'PDF' ? 'border-brand-500 bg-brand-50' : 'border-slate-100 hover:border-slate-200'
                                        }`}
                                >
                                    <FileText className={`w-8 h-8 mb-4 ${type === 'PDF' ? 'text-brand-600' : 'text-slate-400'}`} />
                                    <h3 className="font-bold text-slate-800">PDF Document</h3>
                                    <p className="text-xs text-slate-500 mt-1">Upload a PDF and we'll extract the key concepts.</p>
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {type === 'TOPIC' ? 'What do you want to learn?' : 'Upload your document'}
                                </h2>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Deck title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., React Fundamentals"
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                                    autoFocus
                                />
                            </div>

                            {type === 'TOPIC' ? (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Topic description</label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="e.g., React Hooks, Photosynthesis, WW2 Battle of Midway..."
                                        className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all resize-none"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">PDF file</label>
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-12 hover:border-brand-400 transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        />
                                        <Upload className="w-10 h-10 text-slate-400 mb-4" />
                                        <p className="text-sm font-medium text-slate-700">
                                            {file ? file.name : 'Click to upload or drag and drop'}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">PDF up to 10MB</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                {step === 2 && (
                    <button
                        onClick={() => setStep(1)}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        Back
                    </button>
                )}
                <div className="ml-auto">
                    <button
                        onClick={handleNext}
                        disabled={(!type && step === 1) || (step === 2 && !canProceedStep2) || isProcessing}
                        className="flex items-center px-6 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                {step === 1 ? 'Next' : 'Create Deck'}
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
