'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Package, User } from 'lucide-react'
import styles from './Navbar.module.css'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

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
                    <Link href="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                        Login
                    </Link>
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
            </div>
        </header>
    )
}
