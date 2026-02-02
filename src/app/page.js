import Link from 'next/link'
import { Search, Truck, MapPin, Package, Globe, ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import styles from './page.module.css'

export default function Home() {
    return (
        <>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={`container ${styles.heroContent}`}>
                    <div className={styles.heroText}>
                        <h1 className="animate-reveal">Operating System for Commerce</h1>
                        <p className="animate-reveal" style={{ animationDelay: '0.1s' }}>
                            India's largest fully integrated logistics provider. We bridge the gap between businesses and customers through world-class infrastructure.
                        </p>
                        <div className="flex animate-reveal" style={{ gap: '1.5rem', flexWrap: 'wrap', animationDelay: '0.2s' }}>
                            <Link href="/dashboard/book" className="brutal-btn brutal-btn-primary" style={{ minWidth: '200px' }}>
                                Ship Now <ArrowRight size={20} strokeWidth={3} />
                            </Link>
                            <Link href="/services" className="brutal-btn" style={{ minWidth: '200px' }}>
                                Explore Services
                            </Link>
                        </div>
                    </div>

                    <div className={`${styles.trackingWidget} animate-reveal`} style={{ animationDelay: '0.3s' }}>
                        <div className={styles.trackingTitle}>
                            <Search size={24} strokeWidth={3} />
                            Track Shipment
                        </div>
                        <form className={styles.trackingForm} action="/track">
                            <input
                                type="text"
                                name="awb"
                                placeholder="Waybill / AWB Number"
                                className={styles.input}
                                required
                            />
                            <button type="submit" className="brutal-btn brutal-btn-accent w-full">
                                Track Order
                            </button>
                        </form>
                        <p style={{ marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--gray-500)', fontWeight: '600' }}>
                            Popular: #AWB-12345, #DEL-98765
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className={styles.statsSection}>
                <div className={`container ${styles.statsGrid}`}>
                    <div className={styles.statItem}>
                        <h3>2.1B+</h3>
                        <p>Orders Delivered</p>
                    </div>
                    <div className={styles.statItem}>
                        <h3>18.5K</h3>
                        <p>Pin Codes Covered</p>
                    </div>
                    <div className={styles.statItem}>
                        <h3>2.5M+</h3>
                        <p>Sq. Ft Storage</p>
                    </div>
                    <div className={styles.statItem}>
                        <h3>99.9%</h3>
                        <p>Safe Delivery</p>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className={styles.features}>
                <div className="container">
                    <div className={styles.sectionTitle}>
                        <h2 className="animate-reveal">Our Logistics Stack</h2>
                        <p className="animate-reveal" style={{ color: 'var(--gray-500)', marginTop: '1.5rem', fontWeight: '500', animationDelay: '0.1s' }}>
                            End-to-end solutions for every business scale.
                        </p>
                    </div>

                    <div className={styles.servicesGrid}>
                        <div className={`${styles.serviceCard} animate-reveal`} style={{ animationDelay: '0.1s' }}>
                            <Zap size={40} className={styles.cardIcon} strokeWidth={2.5} />
                            <h3 className={styles.cardTitle}>Express Parcel</h3>
                            <p className={styles.cardText}>
                                Door-to-door delivery for parcels with real-time tracking and automated alerts.
                            </p>
                            <Link href="/services/express" className={styles.cardLink}>
                                Explore Express <ArrowRight size={18} strokeWidth={3} />
                            </Link>
                        </div>

                        <div className={`${styles.serviceCard} animate-reveal`} style={{ animationDelay: '0.2s' }}>
                            <Truck size={40} className={styles.cardIcon} strokeWidth={2.5} />
                            <h3 className={styles.cardTitle}>Truck Load</h3>
                            <p className={styles.cardText}>
                                Efficient B2B express service for shipments larger than a parcel but smaller than a full truck.
                            </p>
                            <Link href="/services/ptl" className={styles.cardLink}>
                                Explore PTL <ArrowRight size={18} strokeWidth={3} />
                            </Link>
                        </div>

                        <div className={`${styles.serviceCard} animate-reveal`} style={{ animationDelay: '0.3s' }}>
                            <ShieldCheck size={40} className={styles.cardIcon} strokeWidth={2.5} />
                            <h3 className={styles.cardTitle}>Supply Chain</h3>
                            <p className={styles.cardText}>
                                Comprehensive warehousing and inventory management powered by our proprietary tech stack.
                            </p>
                            <Link href="/services/supply-chain" className={styles.cardLink}>
                                Explore Supply Chain <ArrowRight size={18} strokeWidth={3} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ backgroundColor: 'var(--white)', padding: 'clamp(5rem, 12vw, 8rem) 0', borderTop: '6px solid var(--secondary)' }}>
                <div className="container">
                    <div className="brutal-card" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'center', textAlign: 'center' }}>
                        <h2 style={{ maxWidth: '700px' }}>Ready to scale your business logistics?</h2>
                        <p style={{ maxWidth: '600px', color: 'var(--gray-600)', fontSize: '1.25rem' }}>Join 30,000+ businesses that trust our platform for their daily shipping needs.</p>
                        <div className="flex" style={{ gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Link href="/register" className="brutal-btn brutal-btn-primary" style={{ minWidth: '220px' }}>Create Free Account</Link>
                            <Link href="/contact" className="brutal-btn" style={{ minWidth: '220px' }}>Schedule Demo</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
