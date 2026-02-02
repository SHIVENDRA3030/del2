'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Package, LogOut, LayoutDashboard, Shield, Briefcase } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import styles from './Navbar.module.css'

const ADMIN_ROLE_ID = '07c9fe4c-7b70-4c4a-9d1f-7de4878c9103'
const EMPLOYEE_ROLE_ID = '5cfb9439-d269-44d3-b6c2-1d7d1d0898b0'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isEmployee, setIsEmployee] = useState(false)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            if (user) {
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('role_id')
                    .eq('id', user.id)
                    .single()

                setIsAdmin(profile?.role_id === ADMIN_ROLE_ID)
                setIsEmployee(profile?.role_id === EMPLOYEE_ROLE_ID)
            }
            setLoading(false)
        }

        checkUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null)
            if (!session?.user) {
                setIsAdmin(false)
                setIsEmployee(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setIsAdmin(false)
        setIsEmployee(false)
        router.push('/')
        router.refresh()
    }

    const toggleMenu = () => setIsOpen(!isOpen)

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Track', href: '/track' },
        { name: 'Services', href: '/services' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ]

    return (
        <header className={styles.header}>
            <div className={`container ${styles.navContainer}`}>
                {/* Logo */}
                <Link href="/" className={styles.logo} onClick={() => setIsOpen(false)}>
                    <Package size={28} strokeWidth={3} />
                    DELHIVERY<span>CLONE</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className={styles.desktopNav}>
                    <ul className={styles.navLinks}>
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link href={link.href} className={styles.navLink}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
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
                            {isEmployee && (
                                <Link href="/employee" className={styles.employeeLink} title="Employee Portal">
                                    <Briefcase size={20} />
                                </Link>
                            )}
                            <Link href="/dashboard" className="brutal-btn" style={{ minHeight: '44px', padding: '0 1rem', fontSize: '0.875rem' }}>
                                <LayoutDashboard size={18} />
                                <span className={styles.dashboardText}>Dashboard</span>
                            </Link>
                            <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="brutal-btn brutal-btn-primary" style={{ minHeight: '44px', padding: '0 1.5rem', fontSize: '0.875rem' }}>
                            Login
                        </Link>
                    )}
                    <button className={styles.mobileMenuBtn} onClick={toggleMenu} aria-label="Toggle Menu">
                        {isOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className={styles.mobileMenu}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className={styles.mobileLinks}>
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link href={link.href} className={styles.mobileNavLink} onClick={toggleMenu}>
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                            {user && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: navLinks.length * 0.05 }}
                                >
                                    <Link href="/dashboard" className={styles.mobileNavLink} onClick={toggleMenu}>
                                        Dashboard
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                        
                        {user ? (
                            <motion.button 
                                onClick={() => { handleLogout(); toggleMenu(); }} 
                                className={styles.mobileLogout}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <LogOut size={20} style={{ marginRight: '0.75rem' }} strokeWidth={3} />
                                Logout
                            </motion.button>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                style={{ marginTop: 'auto' }}
                            >
                                <Link href="/login" className="brutal-btn brutal-btn-accent w-full" onClick={toggleMenu}>
                                    Login / Sign Up
                                </Link>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
