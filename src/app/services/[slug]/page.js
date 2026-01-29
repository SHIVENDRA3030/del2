'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Package, Truck, Globe, Warehouse, ArrowLeft } from 'lucide-react'
import styles from './page.module.css'

const servicesData = {
    express: {
        name: 'Express Parcel',
        tagline: 'Fast, reliable delivery for time-sensitive shipments',
        icon: Package,
        description: 'Our Express Parcel service is designed for businesses and individuals who need fast, reliable delivery. With same-day and next-day options, real-time tracking, and proof of delivery, we ensure your packages reach their destination on time, every time.',
        features: [
            { title: 'Same-Day Delivery', desc: 'Get your packages delivered within hours in select cities' },
            { title: 'Next-Day Delivery', desc: 'Guaranteed next-day delivery across 18,000+ pin codes' },
            { title: 'Real-Time Tracking', desc: 'Track your shipment at every step with live updates' },
            { title: 'Proof of Delivery', desc: 'Digital signature and photo proof for every delivery' },
            { title: 'Insurance Coverage', desc: 'Optional insurance for high-value items' },
            { title: 'Flexible Pickup', desc: 'Schedule pickups at your convenience' }
        ]
    },
    ptl: {
        name: 'Part Truck Load (PTL)',
        tagline: 'Cost-effective shared trucking for businesses',
        icon: Truck,
        description: 'Part Truck Load service offers an economical solution for shipments that don\'t fill an entire truck. Share space with other shipments and save on costs while maintaining reliability.',
        features: [
            { title: 'Cost Savings', desc: 'Pay only for the space you use' },
            { title: 'Scheduled Routes', desc: 'Regular departures on fixed routes' },
            { title: 'Multi-City Coverage', desc: 'Extensive network across major cities' },
            { title: 'Consolidation', desc: 'Professional cargo consolidation' },
            { title: 'Tracking', desc: 'Full visibility throughout transit' },
            { title: 'Flexible Volumes', desc: 'Ship from 50kg to several tonnes' }
        ]
    },
    freight: {
        name: 'Full Truck Load (FTL)',
        tagline: 'Dedicated trucks for your large shipments',
        icon: Truck,
        description: 'Full Truck Load provides dedicated vehicle capacity for your shipments. Ideal for large volumes, high-value cargo, or time-critical deliveries where you need complete control.',
        features: [
            { title: 'Dedicated Vehicle', desc: 'Entire truck capacity for your cargo' },
            { title: 'Direct Routes', desc: 'No stops or transshipment' },
            { title: 'Heavy Cargo', desc: 'Handle up to 25 tonnes per trip' },
            { title: 'Special Cargo', desc: 'ODC and hazardous material handling' },
            { title: 'GPS Tracking', desc: 'Real-time vehicle location' },
            { title: 'Fastest Transit', desc: 'Shortest delivery times guaranteed' }
        ]
    },
    'cross-border': {
        name: 'Cross Border Shipping',
        tagline: 'Global reach with local expertise',
        icon: Globe,
        description: 'Expand your business globally with our cross-border shipping solutions. We handle customs, documentation, and last-mile delivery in 220+ countries.',
        features: [
            { title: '220+ Countries', desc: 'Worldwide delivery network' },
            { title: 'Customs Clearance', desc: 'Expert handling of import/export documentation' },
            { title: 'Air Freight', desc: 'Express air cargo services' },
            { title: 'Sea Freight', desc: 'Economical ocean shipping' },
            { title: 'Door-to-Door', desc: 'Complete end-to-end service' },
            { title: 'Duty Management', desc: 'DDP and DDU options available' }
        ]
    },
    warehousing: {
        name: 'Warehousing & Fulfillment',
        tagline: 'End-to-end fulfillment solutions',
        icon: Warehouse,
        description: 'Our strategically located fulfillment centers across India enable faster delivery and lower costs. We handle storage, picking, packing, and shipping so you can focus on growing your business.',
        features: [
            { title: 'Pan-India Network', desc: '75+ fulfillment centers' },
            { title: 'Inventory Management', desc: 'Real-time stock visibility' },
            { title: 'Pick & Pack', desc: 'Accurate order fulfillment' },
            { title: 'Returns Processing', desc: 'Efficient reverse logistics' },
            { title: 'Integration', desc: 'Connect with major marketplaces' },
            { title: 'Analytics', desc: 'Detailed performance reports' }
        ]
    }
}

export default function ServiceDetailPage() {
    const params = useParams()
    const service = servicesData[params.slug]

    if (!service) {
        return (
            <div className={styles.container}>
                <h1>Service Not Found</h1>
                <Link href="/services">← Back to Services</Link>
            </div>
        )
    }

    const Icon = service.icon

    return (
        <div className={styles.container}>
            <Link href="/services" className={styles.backLink}>
                <ArrowLeft size={18} /> Back to Services
            </Link>

            <div className={styles.hero}>
                <div className={styles.iconWrapper}>
                    <Icon size={48} />
                </div>
                <h1>{service.name}</h1>
                <p className={styles.tagline}>{service.tagline}</p>
            </div>

            <div className={styles.content}>
                <p className={styles.description}>{service.description}</p>

                <h2>Key Features</h2>
                <div className={styles.featuresGrid}>
                    {service.features.map((feature, idx) => (
                        <div key={idx} className={styles.featureCard}>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </div>

                <div className={styles.cta}>
                    <h2>Ready to get started?</h2>
                    <div className={styles.ctaButtons}>
                        <Link href="/contact" className="btn btn-primary">Contact Sales</Link>
                        <Link href="/dashboard/book" className="btn btn-outline">Book Now</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
