'use client'

import Link from 'next/link'
import { Search, Truck, Package, Globe } from 'lucide-react'
import { Hero } from '@/components/layout/Hero'
import { StatsGrid } from '@/components/layout/StatsGrid'
import { FeatureCard } from '@/components/layout/FeatureCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import styles from './page.module.css'

export default function Home() {
  const stats = [
    { value: '2B+', label: 'Orders Fulfilled' },
    { value: '18K+', label: 'Pin Codes Served' },
    { value: '100+', label: 'Automated Sort Centers' },
    { value: '24/7', label: 'Support Available' },
  ]

  const services = [
    {
      icon: Package,
      title: 'Express Parcel',
      description: 'Heavy goods, furniture, and large appliances delivery service with installation support.',
      href: '/services/express',
    },
    {
      icon: Truck,
      title: 'Part Truck Load',
      description: 'B2B express service with competitive rates and high reliability for LTL shipments.',
      href: '/services/ptl',
    },
    {
      icon: Globe,
      title: 'Cross Border',
      description: 'Door-to-door express parcel and air freight service to 220+ countries.',
      href: '/services/cross-border',
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <Hero
        title="The Operating System for Commerce"
        subtitle="India's largest fully integrated logistics provider"
        description="We offer a full suite of services including express parcel, PTL, FTL, cross-border and supply chain services."
        primaryCta="Our Services"
        secondaryCta="Contact Sales"
        className={styles.heroOverride}
      >
        <div className={styles.trackingWidget}>
          <div className={styles.trackingTitle}>
            <Search size={24} />
            Track Your Shipment
          </div>
          <p className={styles.trackingSubtitle}>
            Enter your Waybill / AWB or Order ID to track status
          </p>
          <form className={styles.trackingForm} action="/track">
            <div className={styles.inputGroup}>
              <Input
                type="text"
                name="awb"
                placeholder="Tracking ID / AWB / Mobile"
                size="md"
                required
              />
              <Button variant="primary" type="submit">
                Track
              </Button>
            </div>
          </form>
        </div>
      </Hero>

      {/* Stats Section */}
      <StatsGrid stats={stats} className={styles.statsOverride} />

      {/* Services Section */}
      <section className={styles.servicesSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Integrated Logistics Services</h2>
          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <FeatureCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                href={service.href}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
