import Link from 'next/link'
import { Package } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.brandCol}>
                        <div className={styles.brandName}>
                            <Package size={24} color="var(--primary)" />
                            DELHIVERY<span style={{ color: 'var(--primary)' }}>CLONE</span>
                        </div>
                        <p className={styles.description}>
                            India's largest fully integrated logistics provider. We aim to build the operating system for commerce in India.
                        </p>
                    </div>

                    <div>
                        <h3 className={styles.colTitle}>Services</h3>
                        <ul className={styles.linkList}>
                            <li><Link href="/services/express" className={styles.link}>Express Parcel</Link></li>
                            <li><Link href="/services/freight" className={styles.link}>Part Truck Load</Link></li>
                            <li><Link href="/services/freight" className={styles.link}>Full Truck Load</Link></li>
                            <li><Link href="/services/cross-border" className={styles.link}>Cross Border</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className={styles.colTitle}>Company</h3>
                        <ul className={styles.linkList}>
                            <li><Link href="/about" className={styles.link}>About Us</Link></li>
                            <li><Link href="/careers" className={styles.link}>Careers</Link></li>
                            <li><Link href="/news" className={styles.link}>News & Media</Link></li>
                            <li><Link href="/contact" className={styles.link}>Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className={styles.colTitle}>Support</h3>
                        <ul className={styles.linkList}>
                            <li><Link href="/track" className={styles.link}>Track Shipment</Link></li>
                            <li><Link href="/support" className={styles.link}>Raise a Query</Link></li>
                            <li><Link href="/fraud-alert" className={styles.link}>Fraud Alert</Link></li>
                            <li><Link href="/terms" className={styles.link}>Terms & Conditions</Link></li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottomBar}>
                    © {new Date().getFullYear()} Delhivery Clone. All rights reserved. This is a demo project.
                </div>
            </div>
        </footer>
    )
}
