'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Package, Truck, CheckCircle, Clock, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from './page.module.css'

export default function Dashboard() {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ total: 0, inTransit: 0, delivered: 0, pending: 0 })
    const [recentShipments, setRecentShipments] = useState([])
    const supabase = createClient()

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const { data: shipments, error } = await supabase
                    .from('shipments')
                    .select('id, status, created_at')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })

                if (error) {
                    console.error('Error fetching shipments:', error)
                } else if (shipments) {
                    setRecentShipments(shipments.slice(0, 5))

                    const newStats = shipments.reduce((acc, curr) => {
                        acc.total++
                        if (curr.status === 'DELIVERED') acc.delivered++
                        else if (curr.status === 'IN_TRANSIT') acc.inTransit++
                        else acc.pending++
                        return acc
                    }, { total: 0, inTransit: 0, delivered: 0, pending: 0 })

                    setStats(newStats)
                }

            } catch (err) {
                console.error('Unexpected error:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <div className="loadingDot"></div>
        </div>
    )

    return (
        <div className="animate-reveal">
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Welcome Back</h1>
                <p style={{ color: 'var(--gray-500)' }}>Manage your shipments and track real-time delivery status.</p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className="flex items-center justify-between">
                        <div className={styles.statLabel}>Total Orders</div>
                        <Package size={20} color="var(--gray-400)" />
                    </div>
                    <div className={styles.statValue}>{stats.total}</div>
                </div>
                <div className={styles.statCard}>
                    <div className="flex items-center justify-between">
                        <div className={styles.statLabel}>In Transit</div>
                        <Truck size={20} color="var(--info)" />
                    </div>
                    <div className={styles.statValue}>{stats.inTransit}</div>
                </div>
                <div className={styles.statCard}>
                    <div className="flex items-center justify-between">
                        <div className={styles.statLabel}>Delivered</div>
                        <CheckCircle size={20} color="var(--success)" />
                    </div>
                    <div className={styles.statValue}>{stats.delivered}</div>
                </div>
                <div className={styles.statCard}>
                    <div className="flex items-center justify-between">
                        <div className={styles.statLabel}>Pending</div>
                        <Clock size={20} color="var(--warning)" />
                    </div>
                    <div className={styles.statValue}>{stats.pending}</div>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Recent Activity</h2>
                    <Link href="/dashboard/shipments" className="btn btn-outline" style={{ height: '40px', minHeight: '40px', padding: '0 1rem', fontSize: '0.875rem' }}>
                        View All Shipments
                    </Link>
                </div>

                {/* Mobile Card View */}
                <div className={styles.shipmentCards}>
                    {recentShipments.length === 0 ? (
                        <div className="sharp-card text-center" style={{ background: 'var(--white)' }}>
                            <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>No recent shipments found.</p>
                            <Link href="/dashboard/book" className="btn btn-primary">Book Your First Shipment</Link>
                        </div>
                    ) : (
                        recentShipments.map((shipment) => (
                            <div key={shipment.id} className={styles.shipmentCard}>
                                <div className={styles.cardHeader}>
                                    <div>
                                        <div className={styles.bookingId}>#{shipment.id.substring(0, 8).toUpperCase()}</div>
                                        <div className={styles.cardDate}>{new Date(shipment.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <span className={`${styles.statusBadge} ${styles['status_' + (shipment.status || 'PENDING')]}`}>
                                        {shipment.status || 'PENDING'}
                                    </span>
                                </div>
                                <div className={styles.cardFooter}>
                                    <Link href={`/track?awb=${shipment.id}`} className="btn btn-outline" style={{ flex: 1, minHeight: '40px', height: '40px' }}>
                                        Track <ExternalLink size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop Table View */}
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Date Created</th>
                                <th>Shipment Status</th>
                                <th style={{ textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentShipments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)' }}>
                                        No recent shipments. <Link href="/dashboard/book" className="text-primary font-bold">Start shipping →</Link>
                                    </td>
                                </tr>
                            ) : (
                                recentShipments.map((shipment) => (
                                    <tr key={shipment.id}>
                                        <td style={{ fontWeight: 700, fontFamily: 'Space Grotesk' }}>#{shipment.id.substring(0, 12).toUpperCase()}</td>
                                        <td>{new Date(shipment.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles['status_' + (shipment.status || 'PENDING')]}`}>
                                                {shipment.status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <Link href={`/track?awb=${shipment.id}`} className="btn btn-outline" style={{ height: '36px', minHeight: '36px', padding: '0 0.75rem', fontSize: '0.8125rem' }}>
                                                Track Shipment
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
