'use client'

import styles from './page.module.css'

export default function AdminSettingsPage() {
    return (
        <div>
            <h1 className={styles.title}>Admin Settings</h1>

            <div className={styles.section}>
                <h2>System Information</h2>
                <div className={styles.info}>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Application</span>
                        <span className={styles.value}>Delhivery Clone</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Version</span>
                        <span className={styles.value}>1.0.0</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Framework</span>
                        <span className={styles.value}>Next.js 14</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Database</span>
                        <span className={styles.value}>Supabase PostgreSQL</span>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h2>Quick Links</h2>
                <ul className={styles.links}>
                    <li>
                        <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                            Supabase Dashboard →
                        </a>
                    </li>
                    <li>
                        <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                            Vercel Dashboard →
                        </a>
                    </li>
                </ul>
            </div>

            <div className={styles.section}>
                <h2>Danger Zone</h2>
                <p className={styles.warning}>
                    These actions are irreversible. Please proceed with caution.
                </p>
                <button className={styles.dangerBtn} disabled>
                    Clear All Shipments (Disabled)
                </button>
            </div>
        </div>
    )
}
