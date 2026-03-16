import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Mail, Lock, Loader2, UserPlus } from 'lucide-react'

export const Route = createFileRoute('/signup')({
    component: SignUp,
})

function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-paper-100 p-4 font-sans">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-paper-200 p-8 text-center">
                    <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <UserPlus className="w-8 h-8 text-brand-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-ink-900 mb-3 tracking-tight">Check your email</h1>
                    <p className="text-ink-500 mb-8 text-sm leading-relaxed">
                        We've sent a verification link to <span className="font-semibold text-ink-900">{email}</span>. Please click the link to activate your account.
                    </p>
                    <button
                        onClick={() => navigate({ to: '/login' })}
                        className="w-full py-3 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 transition-all mb-6 shadow-sm"
                    >
                        Return to Login
                    </button>
                    <div className="text-center text-sm">
                        <p className="text-ink-400">
                            Didn't receive an email? <span className="text-brand-500 font-medium cursor-pointer hover:underline">Resend</span>
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-paper-100 p-4 font-sans text-ink-500">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-paper-200 p-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-ink-900">Create Account</h1>
                    <p className="text-ink-400 mt-2 text-sm">Start building your knowledge base today.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-5">
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
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-paper-300 rounded-xl focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none transition-all text-sm placeholder-ink-300"
                                placeholder="Min. 6 characters"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 py-3 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-sm"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <p className="text-ink-400">
                        Already have an account? <Link to="/login" className="text-brand-500 font-semibold hover:text-brand-600 transition-colors ml-1">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
