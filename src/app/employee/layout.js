'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Package, LayoutDashboard, Truck, LogOut, Loader } from 'lucide-react'
import styles from './layout.module.css'

const EMPLOYEE_ROLE_ID = '5cfb9439-d269-44d3-b6c2-1d7d1d0898b0'
const ADMIN_ROLE_ID = '07c9fe4c-7b70-4c4a-9d1f-7de4878c9103'

export default function EmployeeLayout({ children }) {
    const [loading, setLoading] = useState(true)
    const [authorized, setAuthorized] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function checkAccess() {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            const { data: profile } = await supabase
                .from('user_profiles')
                .select('role_id')
                .eq('id', user.id)
                .single()

            // Allow both employees and admins
            if (profile?.role_id === EMPLOYEE_ROLE_ID || profile?.role_id === ADMIN_ROLE_ID) {
                setAuthorized(true)
            } else {
                router.push('/dashboard')
            }
            setLoading(false)
        }

        checkAccess()
    }, [router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    if (loading) {
        return (
            <div className={styles.loadingScreen}>
                <Loader className="animate-spin" size={32} />
                <p>Loading...</p>
            </div>
        )
    }

    if (!authorized) return null

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <Truck size={24} />
                    <span>Employee Portal</span>
                </div>

                <nav>
                    <Link href="/employee" className={styles.navItem}>
                        <LayoutDashboard size={20} />
                        Overview
                    </Link>
                    <Link href="/employee/shipments" className={styles.navItem}>
                        <Package size={20} />
                        Shipments
                    </Link>
                </nav>

                <div className={styles.footer}>
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
