'use client'

import { Package, Truck, Globe, Warehouse } from 'lucide-react'
import { Hero } from '@/components/layout/Hero'
import { FeatureCard } from '@/components/layout/FeatureCard'
import styles from './page.module.css'

const services = [
  {
    id: 'express',
    name: 'Express Parcel',
    description: 'Fast and reliable delivery for your urgent shipments. Same-day and next-day delivery options available.',
    icon: Package,
  },
  {
    id: 'ptl',
    name: 'Part Truck Load (PTL)',
    description: 'Cost-effective LTL shipping for businesses. Ideal for shipments that don\'t require a full truck.',
    icon: Truck,
  },
  {
    id: 'freight',
    name: 'Full Truck Load (FTL)',
    description: 'Dedicated trucks for large shipments. Complete control over your cargo with direct delivery.',
    icon: Truck,
  },
  {
    id: 'cross-border',
    name: 'Cross Border',
    description: 'International shipping to 220+ countries. Door-to-door express and air freight services.',
    icon: Globe,
  },
  {
    id: 'warehousing',
    name: 'Warehousing',
    description: 'End-to-end fulfillment solutions with strategically located warehouses across India.',
    icon: Warehouse,
  },
]

export default function ServicesPage() {
  return (
    <>
      <Hero
        title="Our Services"
        description="Integrated logistics solutions for every business need. From express parcels to cross-border shipping, we've got you covered."
        className={styles.heroOverride}
      />

      <section className={styles.servicesSection}>
        <div className="container">
          <div className={styles.servicesGrid}>
            {services.map((service) => (
              <FeatureCard
                key={service.id}
                icon={service.icon}
                title={service.name}
                description={service.description}
                href={`/services/${service.id}`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
