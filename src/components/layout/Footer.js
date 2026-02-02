import Link from 'next/link'
import { Package, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.brandCol}>
                        <div className={styles.brandName}>
                            <Package size={32} strokeWidth={3} />
                            DELHIVERY<span>CLONE</span>
                        </div>
                        <p className={styles.description}>
                            Building the operating system for commerce. India's largest fully integrated logistics provider with world-class infrastructure.
                        </p>
                        <div className={styles.socials}>
                            <a href="#" className={styles.socialIcon} aria-label="Facebook"><Facebook size={20} strokeWidth={2.5} /></a>
                            <a href="#" className={styles.socialIcon} aria-label="Twitter"><Twitter size={20} strokeWidth={2.5} /></a>
                            <a href="#" className={styles.socialIcon} aria-label="Instagram"><Instagram size={20} strokeWidth={2.5} /></a>
                            <a href="#" className={styles.socialIcon} aria-label="LinkedIn"><Linkedin size={20} strokeWidth={2.5} /></a>
                        </div>
                    </div>

                    <div>
                        <h3 className={styles.colTitle}>Services</h3>
                        <ul className={styles.linkList}>
                            <li><Link href="/services" className={styles.link}>Express Parcel</Link></li>
                            <li><Link href="/services" className={styles.link}>Part Truck Load</Link></li>
                            <li><Link href="/services" className={styles.link}>Full Truck Load</Link></li>
                            <li><Link href="/services" className={styles.link}>Cross Border</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className={styles.colTitle}>Company</h3>
                        <ul className={styles.linkList}>
                            <li><Link href="/about" className={styles.link}>About Us</Link></li>
                            <li><Link href="/contact" className={styles.link}>Contact Us</Link></li>
                            <li><Link href="#" className={styles.link}>Careers</Link></li>
                            <li><Link href="#" className={styles.link}>News</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className={styles.colTitle}>Support</h3>
                        <ul className={styles.linkList}>
                            <li><Link href="/track" className={styles.link}>Track Shipment</Link></li>
                            <li><Link href="#" className={styles.link}>Fraud Alert</Link></li>
                            <li><Link href="#" className={styles.link}>Terms & Conditions</Link></li>
                            <li><Link href="#" className={styles.link}>Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottomBar}>
                    <p>© {new Date().getFullYear()} Delhivery Clone. Built with pride.</p>
                    <div className={styles.flex} style={{ gap: '1.5rem' }}>
                        <Link href="#" className={styles.link}>Security</Link>
                        <Link href="#" className={styles.link}>Accessibility</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
