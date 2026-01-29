'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Package, Clock, Truck, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import styles from './page.module.css'

export default function EmployeeDashboard() {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inTransit: 0,
        delivered: 0
    })
    const [recentShipments, setRecentShipments] = useState([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchStats()
        fetchRecentShipments()
    }, [])

    async function fetchStats() {
        const { count: total } = await supabase
            .from('shipments')
            .select('*', { count: 'exact', head: true })

        const { count: pending } = await supabase
            .from('shipments')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'PENDING')

        const { count: inTransit } = await supabase
            .from('shipments')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'IN_TRANSIT')

        const { count: delivered } = await supabase
            .from('shipments')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'DELIVERED')

        setStats({ total: total || 0, pending: pending || 0, inTransit: inTransit || 0, delivered: delivered || 0 })
    }

    async function fetchRecentShipments() {
        const { data } = await supabase
            .from('shipments')
            .select('*, user_profiles(full_name)')
            .order('created_at', { ascending: false })
            .limit(5)

        setRecentShipments(data || [])
        setLoading(false)
    }

    if (loading) return <div className={styles.loading}>Loading...</div>

    return (
        <div>
            <h1 className={styles.title}>Employee Dashboard</h1>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}><Package size={24} /></div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats.total}</span>
                        <span className={styles.statLabel}>Total Shipments</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.pending}`}><Clock size={24} /></div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats.pending}</span>
                        <span className={styles.statLabel}>Pending</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.transit}`}><Truck size={24} /></div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats.inTransit}</span>
                        <span className={styles.statLabel}>In Transit</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.delivered}`}><CheckCircle size={24} /></div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats.delivered}</span>
                        <span className={styles.statLabel}>Delivered</span>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Recent Shipments</h2>
                    <Link href="/employee/shipments" className={styles.viewAll}>View All</Link>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentShipments.map(shipment => (
                                <tr key={shipment.id}>
                                    <td className={styles.idCell}>{shipment.id.slice(0, 8)}...</td>
                                    <td>{shipment.user_profiles?.full_name || 'Unknown'}</td>
                                    <td>
                                        <span className={`${styles.status} ${styles['status_' + shipment.status]}`}>
                                            {shipment.status}
                                        </span>
                                    </td>
                                    <td>{new Date(shipment.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
