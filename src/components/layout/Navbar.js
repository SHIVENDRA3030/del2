'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Package, LogOut, LayoutDashboard, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from './Navbar.module.css'

const ADMIN_ROLE_ID = '07c9fe4c-7b70-4c4a-9d1f-7de4878c9103'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            if (user) {
                // Check if admin
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('role_id')
                    .eq('id', user.id)
                    .single()

                setIsAdmin(profile?.role_id === ADMIN_ROLE_ID)
            }
            setLoading(false)
        }

        checkUser()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null)
            if (!session?.user) setIsAdmin(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setIsAdmin(false)
        router.push('/')
        router.refresh()
    }

    const toggleMenu = () => setIsOpen(!isOpen)

    return (
        <header className={styles.header}>
            <div className={`container ${styles.navContainer}`}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <Package size={28} color="var(--primary)" />
                    DELHIVERY<span>CLONE</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className={styles.desktopNav}>
                    <ul className={styles.navLinks}>
                        <li><Link href="/" className={styles.navLink}>Home</Link></li>
                        <li><Link href="/track" className={styles.navLink}>Track</Link></li>
                        <li><Link href="/services" className={styles.navLink}>Services</Link></li>
                        <li><Link href="/about" className={styles.navLink}>About</Link></li>
                        <li><Link href="/contact" className={styles.navLink}>Contact</Link></li>
                    </ul>
                </nav>

                {/* Actions */}
                <div className={styles.navActions}>
                    {loading ? (
                        <div className={styles.loadingDot}></div>
                    ) : user ? (
                        <>
                            {isAdmin && (
                                <Link href="/admin" className={styles.adminLink} title="Admin Panel">
                                    <Shield size={20} />
                                </Link>
                            )}
                            <Link href="/dashboard" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                                <LayoutDashboard size={16} style={{ marginRight: '0.5rem' }} />
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                            Login
                        </Link>
                    )}
                    <button className={styles.mobileMenuBtn} onClick={toggleMenu}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
                <Link href="/" className={styles.mobileNavLink} onClick={toggleMenu}>Home</Link>
                <Link href="/track" className={styles.mobileNavLink} onClick={toggleMenu}>Track</Link>
                <Link href="/services" className={styles.mobileNavLink} onClick={toggleMenu}>Services</Link>
                <Link href="/about" className={styles.mobileNavLink} onClick={toggleMenu}>About</Link>
                <Link href="/contact" className={styles.mobileNavLink} onClick={toggleMenu}>Contact</Link>
                {user && (
                    <>
                        <Link href="/dashboard" className={styles.mobileNavLink} onClick={toggleMenu}>Dashboard</Link>
                        {isAdmin && <Link href="/admin" className={styles.mobileNavLink} onClick={toggleMenu}>Admin</Link>}
                        <button onClick={() => { handleLogout(); toggleMenu(); }} className={styles.mobileLogout}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </header>
    )
}
