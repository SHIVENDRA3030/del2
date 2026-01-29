'use client'

import Link from 'next/link'
import { Package, Truck, Globe, Warehouse } from 'lucide-react'
import styles from './page.module.css'

const services = [
    {
        id: 'express',
        name: 'Express Parcel',
        description: 'Fast and reliable delivery for your urgent shipments. Same-day and next-day delivery options available.',
        icon: Package,
        features: ['Same-day delivery', 'Real-time tracking', 'Signature confirmation', 'Insurance coverage']
    },
    {
        id: 'ptl',
        name: 'Part Truck Load (PTL)',
        description: 'Cost-effective LTL shipping for businesses. Ideal for shipments that don\'t require a full truck.',
        icon: Truck,
        features: ['Shared truck space', 'Scheduled pickups', 'Multi-city routes', 'Competitive pricing']
    },
    {
        id: 'freight',
        name: 'Full Truck Load (FTL)',
        description: 'Dedicated trucks for large shipments. Complete control over your cargo with direct delivery.',
        icon: Truck,
        features: ['Dedicated vehicle', 'Fastest transit', 'No transshipment', 'Heavy cargo support']
    },
    {
        id: 'cross-border',
        name: 'Cross Border',
        description: 'International shipping to 220+ countries. Door-to-door express and air freight services.',
        icon: Globe,
        features: ['220+ countries', 'Customs clearance', 'Air freight', 'Express delivery']
    },
    {
        id: 'warehousing',
        name: 'Warehousing',
        description: 'End-to-end fulfillment solutions with strategically located warehouses across India.',
        icon: Warehouse,
        features: ['Pan-India network', 'Inventory management', 'Order fulfillment', 'Returns processing']
    }
]

export default function ServicesPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Our Services</h1>
                <p>Integrated logistics solutions for every business need</p>
            </div>

            <div className={styles.servicesGrid}>
                {services.map((service) => {
                    const Icon = service.icon
                    return (
                        <div key={service.id} className={styles.serviceCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.iconWrapper}>
                                    <Icon size={32} />
                                </div>
                                <h2>{service.name}</h2>
                            </div>
                            <p className={styles.description}>{service.description}</p>
                            <ul className={styles.features}>
                                {service.features.map((feature, idx) => (
                                    <li key={idx}>{feature}</li>
                                ))}
                            </ul>
                            <Link href={`/services/${service.id}`} className={styles.learnMore}>
                                Learn More →
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
