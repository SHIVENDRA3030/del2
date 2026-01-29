'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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

                // Fetch counts
                // Note: For MVP we might not have a lot of data, and 'user_id' assumed in shipments table
                const { data: shipments, error } = await supabase
                    .from('shipments')
                    .select('id, status, created_at, shipment_events(location)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })

                if (error) {
                    console.error('Error fetching shipments:', error)
                    // Dont throw, just show empty
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

    if (loading) return <div style={{ padding: '2rem' }}>Loading dashboard...</div>

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem' }}>Dashboard Overview</h1>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Total Shipments</div>
                    <div className={styles.statValue}>{stats.total}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>In Transit</div>
                    <div className={styles.statValue} style={{ color: 'var(--info)' }}>{stats.inTransit}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Delivered</div>
                    <div className={styles.statValue} style={{ color: 'var(--success)' }}>{stats.delivered}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Pending</div>
                    <div className={styles.statValue} style={{ color: 'var(--warning)' }}>{stats.pending}</div>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Recent Shipments</h2>
                    <Link href="/dashboard/shipments" className="text-primary font-bold">View All</Link>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentShipments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--gray-500)' }}>
                                        No shipments found. <Link href="/dashboard/book" className="text-primary">Book a shipment</Link>
                                    </td>
                                </tr>
                            ) : (
                                recentShipments.map((shipment) => (
                                    <tr key={shipment.id}>
                                        <td>{shipment.id}</td>
                                        <td>{new Date(shipment.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles['status_' + (shipment.status || 'PENDING')]}`}>
                                                {shipment.status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td>
                                            <Link href={`/track?awb=${shipment.id}`} className="text-primary font-bold">Track</Link>
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
