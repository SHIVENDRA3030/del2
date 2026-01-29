'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './page.module.css'

export default function SettingsPage() {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState({ full_name: '' })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState(null)
    const supabase = createClient()

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            setUser(user)

            const { data } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (data) {
                setProfile({ full_name: data.full_name || '' })
            }
            setLoading(false)
        }

        loadProfile()
    }, [])

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        setMessage(null)

        try {
            const { error } = await supabase
                .from('user_profiles')
                .upsert({
                    id: user.id,
                    full_name: profile.full_name,
                    updated_at: new Date().toISOString()
                })

            if (error) throw error

            setMessage({ type: 'success', text: 'Profile updated successfully!' })
        } catch (err) {
            setMessage({ type: 'error', text: err.message })
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className={styles.loading}>Loading...</div>

    return (
        <div>
            <h1 className={styles.title}>Settings</h1>

            <div className={styles.section}>
                <h2>Profile Information</h2>

                {message && (
                    <div className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSave} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Email</label>
                        <input type="email" value={user?.email || ''} disabled />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={profile.full_name}
                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                            placeholder="Your full name"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>

            <div className={styles.section}>
                <h2>Account</h2>
                <p className={styles.hint}>
                    Email: {user?.email}
                </p>
                <p className={styles.hint}>
                    Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
            </div>
        </div>
    )
}
