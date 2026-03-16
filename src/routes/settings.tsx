import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { User, Lock, LogOut, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/settings')({
    component: Settings,
})

function Settings() {
    const navigate = useNavigate()

    const { data: user } = useQuery({
        queryKey: ['auth-user'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser()
            return user
        },
    })

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [passwordSuccess, setPasswordSuccess] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setPasswordError(null)
        setPasswordSuccess(false)

        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters.')
            return
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match.')
            return
        }

        setIsUpdating(true)
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        setIsUpdating(false)

        if (error) {
            setPasswordError(error.message)
        } else {
            setPasswordSuccess(true)
            setNewPassword('')
            setConfirmPassword('')
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate({ to: '/login' })
    }

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage your account.</p>
            </header>

            {/* Account Info */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Account</h2>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-brand-600" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Signed in as</p>
                        <p className="font-semibold text-slate-900">{user?.email ?? '—'}</p>
                    </div>
                </div>
            </section>

            {/* Change Password */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Change Password</h2>
                </div>
                <form onSubmit={handlePasswordUpdate} className="space-y-3">
                    <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="New password"
                        minLength={6}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
                    />
                    {passwordError && (
                        <p className="text-sm text-red-600">{passwordError}</p>
                    )}
                    {passwordSuccess && (
                        <p className="text-sm text-emerald-600">Password updated successfully.</p>
                    )}
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors"
                    >
                        {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                        Update Password
                    </button>
                </form>
            </section>

            {/* Sign Out */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Session</h2>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 border border-red-100 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </section>
        </div>
    )
}
