import Link from 'next/link'
import { Search, Truck, MapPin, Package, Globe } from 'lucide-react'
import styles from './page.module.css'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className={`${styles.hero} animate-fade-in`}>
        <div className={styles.heroContent}>
          <div className={`${styles.heroText} animate-slide-in-up`}>
            <h1>The Operating System for Commerce</h1>
            <p>
              India's largest fully integrated logistics provider. We offer a full suite of services
              including express parcel, PTL, FTL, cross-border and supply chain services.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/services" className="btn btn-primary animate-scale-in">Our Services</Link>
              <Link href="/contact" className="btn btn-outline animate-scale-in" style={{ animationDelay: '0.1s' }}>Contact Sales</Link>
            </div>
          </div>

          <div className={`${styles.trackingWidget} animate-slide-in-up`} style={{ animationDelay: '0.2s' }}>
            <div className={styles.trackingTitle}>
              <Search size={24} />
              Track Your Shipment
            </div>
            <p style={{ marginBottom: '1rem', color: 'var(--gray-600)' }}>
              Enter your Waybill / AWB or Order ID to track status
            </p>
            <form className={styles.trackingForm} action="/track">
              <div className={styles.inputGroup}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="text"
                    name="awb"
                    placeholder="Tracking ID / AWB / Mobile"
                    className={styles.input}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Track</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`${styles.statsSection} animate-fade-in`}>
        <div className={styles.statsGrid}>
          <div className={`${styles.statItem} animate-scale-in`} style={{ animationDelay: '0.1s' }}>
            <h3>2B+</h3>
            <p>Orders Fulfilled</p>
          </div>
          <div className={`${styles.statItem} animate-scale-in`} style={{ animationDelay: '0.2s' }}>
            <h3>18K+</h3>
            <p>Pin Codes Served</p>
          </div>
          <div className={`${styles.statItem} animate-scale-in`} style={{ animationDelay: '0.3s' }}>
            <h3>20+</h3>
            <p>Automated Sort Centers</p>
          </div>
          <div className={`${styles.statItem} animate-scale-in`} style={{ animationDelay: '0.4s' }}>
            <h3>24/7</h3>
            <p>Support Available</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={`${styles.features} animate-fade-in`}>
        <h2 className={`${styles.sectionTitle} animate-slide-in-up`}>Integrated Logistics Services</h2>
        <div className={styles.servicesGrid}>
          <div className={`${styles.serviceCard} animate-slide-in-up`} style={{ animationDelay: '0.1s' }}>
            <Package size={40} className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>Express Parcel</h3>
            <p className={styles.cardText}>
              Heavy goods, furniture, and large appliances delivery service with installation support.
            </p>
            <Link href="/services/express" className="text-primary font-bold">Learn More →</Link>
          </div>

          <div className={`${styles.serviceCard} animate-slide-in-up`} style={{ animationDelay: '0.2s' }}>
            <Truck size={40} className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>Part Truck Load</h3>
            <p className={styles.cardText}>
              B2B express service with competitive rates and high reliability for LTL shipments.
            </p>
            <Link href="/services/ptl" className="text-primary font-bold">Learn More →</Link>
          </div>

          <div className={`${styles.serviceCard} animate-slide-in-up`} style={{ animationDelay: '0.3s' }}>
            <Globe size={40} className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>Cross Border</h3>
            <p className={styles.cardText}>
              Door-to-door express parcel and air freight service to 220+ countries.
            </p>
            <Link href="/services/cross-border" className="text-primary font-bold">Learn More →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
