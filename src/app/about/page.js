'use client'

import styles from './page.module.css'

export default function AboutPage() {
    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <h1>About Delhivery Clone</h1>
                <p>India's largest fully-integrated logistics provider by revenue.</p>
            </section>

            <section className={styles.section}>
                <h2>Our Story</h2>
                <p>
                    Founded with a vision to revolutionize logistics in India, we have grown to become
                    the country's leading technology-driven logistics company. Our journey began with
                    a simple goal: to make shipping seamless, reliable, and accessible for everyone.
                </p>
            </section>

            <section className={styles.section}>
                <h2>Our Mission</h2>
                <p>
                    To build the operating system for commerce through a combination of world-class
                    infrastructure, logistics operations of the highest quality, and cutting-edge
                    technology capabilities.
                </p>
            </section>

            <section className={styles.statsSection}>
                <div className={styles.stat}>
                    <div className={styles.statNumber}>2B+</div>
                    <div className={styles.statLabel}>Orders Delivered</div>
                </div>
                <div className={styles.stat}>
                    <div className={styles.statNumber}>18,000+</div>
                    <div className={styles.statLabel}>Pin Codes Served</div>
                </div>
                <div className={styles.stat}>
                    <div className={styles.statNumber}>20+</div>
                    <div className={styles.statLabel}>Automated Sort Centers</div>
                </div>
                <div className={styles.stat}>
                    <div className={styles.statNumber}>10,000+</div>
                    <div className={styles.statLabel}>Team Members</div>
                </div>
            </section>

            <section className={styles.section}>
                <h2>Why Choose Us</h2>
                <ul className={styles.featureList}>
                    <li>Pan-India network coverage</li>
                    <li>Real-time tracking and visibility</li>
                    <li>Technology-first approach</li>
                    <li>Flexible delivery options</li>
                    <li>Dedicated customer support</li>
                </ul>
            </section>
        </div>
    )
}
