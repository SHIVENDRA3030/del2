'use client'

import { Hero } from '@/components/layout/Hero'
import { StatsGrid } from '@/components/layout/StatsGrid'
import styles from './page.module.css'

const stats = [
  { value: '2B+', label: 'Orders Delivered' },
  { value: '18K+', label: 'Pin Codes Served' },
  { value: '20+', label: 'Automated Sort Centers' },
  { value: '10K+', label: 'Team Members' },
]

export default function AboutPage() {
  return (
    <>
      <Hero
        title="About Delhivery Clone"
        description="India's largest fully-integrated logistics provider by revenue. Building the operating system for commerce."
        className={styles.heroOverride}
      />

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Our Story</h2>
          <p className={styles.sectionText}>
            Founded with a vision to revolutionize logistics in India, we have grown to become
            the country's leading technology-driven logistics company. Our journey began with
            a simple goal: to make shipping seamless, reliable, and accessible for everyone.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.sectionText}>
            To build the operating system for commerce through a combination of world-class
            infrastructure, logistics operations of the highest quality, and cutting-edge
            technology capabilities.
          </p>
        </div>
      </section>

      <StatsGrid stats={stats} className={styles.statsOverride} />

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Why Choose Us</h2>
          <ul className={styles.featureList}>
            <li>Pan-India network coverage</li>
            <li>Real-time tracking and visibility</li>
            <li>Technology-first approach</li>
            <li>Flexible delivery options</li>
            <li>Dedicated customer support</li>
          </ul>
        </div>
      </section>
    </>
  )
}
