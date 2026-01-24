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
            // Optional: Auto redirect after success or show verification email message
            // navigate({ to: '/' })
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h1>
                    <p className="text-slate-500 mb-8">
                        We've sent a verification link to <span className="font-semibold text-slate-900">{email}</span>.
                        Please verify your account to continue.
                    </p>
                    <button
                        onClick={() => navigate({ to: '/login' })}
                        className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all mb-4"
                    >
                        Back to Login
                    </button>
                    <p className="text-sm text-slate-500">
                        Didn't get the email? <span className="text-brand-600 font-semibold cursor-pointer hover:underline">Resend</span> or <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-brand-700">Join Axonote</h1>
                    <p className="text-slate-500 mt-2">Start your journey to smarter learning</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                                placeholder="Min. 6 characters"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 disabled:opacity-50 transition-all flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500">
                        Already have an account? <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
