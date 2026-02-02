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
                        <div className="flex animate-reveal" style={{ gap: '1rem', flexWrap: 'wrap', animationDelay: '0.2s' }}>
                            <Link href="/dashboard/book" className="btn btn-primary btn-wide-mobile">
                                Ship Now <ArrowRight size={18} />
                            </Link>
                            <Link href="/services" className="btn btn-outline btn-wide-mobile">
                                Explore Services
                            </Link>
                        </div>
                    </div>

                    <div className={`${styles.trackingWidget} animate-reveal`} style={{ animationDelay: '0.3s' }}>
                        <div className={styles.trackingTitle}>
                            <Search size={22} />
                            Track Shipment
                        </div>
                        <form className={styles.trackingForm} action="/track">
                            <input
                                type="text"
                                name="awb"
                                placeholder="Enter Waybill / AWB Number"
                                className={styles.input}
                                required
                            />
                            <button type="submit" className="btn btn-secondary">
                                Track Order
                            </button>
                        </form>
                        <p style={{ marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
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
                        <p className="animate-reveal" style={{ color: 'var(--gray-500)', marginTop: '1rem', animationDelay: '0.1s' }}>
                            End-to-end solutions for every business scale.
                        </p>
                    </div>

                    <div className={styles.servicesGrid}>
                        <div className={`${styles.serviceCard} animate-reveal`} style={{ animationDelay: '0.1s' }}>
                            <Zap size={32} className={styles.cardIcon} />
                            <h3 className={styles.cardTitle}>Express Parcel</h3>
                            <p className={styles.cardText}>
                                Door-to-door delivery for small and medium parcels with real-time tracking and automated alerts.
                            </p>
                            <Link href="/services/express" className={styles.cardLink}>
                                Explore Express <ArrowRight size={16} />
                            </Link>
                        </div>

                        <div className={`${styles.serviceCard} animate-reveal`} style={{ animationDelay: '0.2s' }}>
                            <Truck size={32} className={styles.cardIcon} />
                            <h3 className={styles.cardTitle}>Part Truck Load</h3>
                            <p className={styles.cardText}>
                                Efficient B2B express service with competitive rates for shipments larger than a parcel but smaller than a full truck.
                            </p>
                            <Link href="/services/ptl" className={styles.cardLink}>
                                Explore PTL <ArrowRight size={16} />
                            </Link>
                        </div>

                        <div className={`${styles.serviceCard} animate-reveal`} style={{ animationDelay: '0.3s' }}>
                            <ShieldCheck size={32} className={styles.cardIcon} />
                            <h3 className={styles.cardTitle}>Supply Chain</h3>
                            <p className={styles.cardText}>
                                Comprehensive warehousing and inventory management solutions powered by our proprietary tech stack.
                            </p>
                            <Link href="/services/supply-chain" className={styles.cardLink}>
                                Explore Supply Chain <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ backgroundColor: 'var(--gray-50)', padding: '6rem 0' }}>
                <div className="container">
                    <div className="sharp-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', textAlign: 'center', backgroundColor: 'var(--white)' }}>
                        <h2 style={{ maxWidth: '600px' }}>Ready to scale your business logistics?</h2>
                        <p style={{ maxWidth: '500px', color: 'var(--gray-600)' }}>Join 30,000+ businesses that trust our platform for their daily shipping needs.</p>
                        <div className="flex" style={{ gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Link href="/register" className="btn btn-primary">Create Free Account</Link>
                            <Link href="/contact" className="btn btn-outline">Schedule Demo</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
