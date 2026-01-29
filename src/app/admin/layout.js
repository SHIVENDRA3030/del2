'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, Package, Settings, LogOut, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from './layout.module.css'

const ADMIN_ROLE_ID = '07c9fe4c-7b70-4c4a-9d1f-7de4878c9103'

export default function AdminLayout({ children }) {
    const pathname = usePathname()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        async function checkAdmin() {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            // Check if user has admin role
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('role_id')
                .eq('id', user.id)
                .single()

            if (profile?.role_id !== ADMIN_ROLE_ID) {
                // Not admin, redirect to user dashboard
                router.push('/dashboard')
                return
            }

            setIsAdmin(true)
            setLoading(false)
        }

        checkAdmin()
    }, [router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const navItems = [
        { name: 'Overview', href: '/admin', icon: LayoutDashboard },
        { name: 'Shipments', href: '/admin/shipments', icon: Package },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]

    if (loading) {
        return (
            <div className={styles.loadingScreen}>
                <Shield size={48} />
                <p>Verifying admin access...</p>
            </div>
        )
    }

    if (!isAdmin) {
        return null
    }

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <Shield size={24} />
                    <span>Admin Panel</span>
                </div>
                <nav>
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                            >
                                <Icon size={20} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className={styles.footer}>
                    <Link href="/dashboard" className={styles.navItem}>
                        ← User Dashboard
                    </Link>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    )
}
