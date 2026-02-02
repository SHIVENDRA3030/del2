'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, PackagePlus, List, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from './layout.module.css'

export default function DashboardLayout({ children }) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const navItems = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, mobileName: 'Home' },
        { name: 'Book Shipment', href: '/dashboard/book', icon: PackagePlus, mobileName: 'Book' },
        { name: 'My Shipments', href: '/dashboard/shipments', icon: List, mobileName: 'Orders' },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings, mobileName: 'Profile' },
    ]

    return (
        <div className={styles.container}>
            {/* Desktop Sidebar */}
            <aside className={styles.sidebar}>
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

                <div className={styles.userProfile}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className={styles.mobileNav}>
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.mobileNavItem} ${isActive ? styles.active : ''}`}
                        >
                            <Icon size={24} />
                            <span>{item.mobileName}</span>
                        </Link>
                    )
                })}
            </nav>

            <main className={styles.main}>
                {children}
            </main>
        </div>
    )
}
