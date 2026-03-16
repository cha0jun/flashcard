import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Mail, Lock, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/login')({
    component: Login,
})

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            setError(error.message)
        } else {
            navigate({ to: '/' })
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-paper-100 p-4 font-sans text-ink-500">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-paper-200 p-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-ink-900">Axonote</h1>
                    <p className="text-ink-400 mt-2 text-sm">Welcome back. Please sign in to your account.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-ink-600 mb-1.5">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-300" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-paper-300 rounded-xl focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none transition-all text-sm placeholder-ink-300"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-ink-600 mb-1.5">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-300" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-paper-300 rounded-xl focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none transition-all text-sm placeholder-ink-300"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 py-3 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-sm"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <p className="text-ink-400">
                        Don't have an account? <Link to="/signup" className="text-brand-500 font-semibold hover:text-brand-600 transition-colors ml-1">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
