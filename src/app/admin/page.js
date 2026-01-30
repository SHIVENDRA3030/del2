'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Package, Users, TrendingUp, Clock } from 'lucide-react'
import styles from './page.module.css'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalShipments: 0,
        totalUsers: 0,
        pendingShipments: 0,
        todayShipments: 0
    })
    const [recentShipments, setRecentShipments] = useState([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchStats() {
            try {
                // Get total shipments
                const { count: totalShipments } = await supabase
                    .from('shipments')
                    .select('*', { count: 'exact', head: true })

                // Get total users
                const { count: totalUsers } = await supabase
                    .from('user_profiles')
                    .select('*', { count: 'exact', head: true })

                // Get pending shipments
                const { count: pendingShipments } = await supabase
                    .from('shipments')
                    .select('*', { count: 'exact', head: true })
                    .in('status', ['PENDING', 'BOOKED'])

                // Get today's shipments
                const today = new Date().toISOString().split('T')[0]
                const { count: todayShipments } = await supabase
                    .from('shipments')
                    .select('*', { count: 'exact', head: true })
                    .gte('created_at', today)

                setStats({
                    totalShipments: totalShipments || 0,
                    totalUsers: totalUsers || 0,
                    pendingShipments: pendingShipments || 0,
                    todayShipments: todayShipments || 0
                })

                // Get recent shipments
                const { data: shipments } = await supabase
                    .from('shipments')
                    .select('*, user_profiles(full_name)')
                    .order('created_at', { ascending: false })
                    .limit(10)

                setRecentShipments(shipments || [])
            } catch (err) {
                console.error('Error fetching admin stats:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (loading) return <div className={styles.loading}>Loading dashboard...</div>

    return (
        <div>
            <h1 className={styles.title}>Admin Dashboard</h1>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#ccfbf1' }}>
                        <Package size={24} color="#0f766e" />
                    </div>
                    <div>
                        <div className={styles.statValue}>{stats.totalShipments}</div>
                        <div className={styles.statLabel}>Total Shipments</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#d1fae5' }}>
                        <Users size={24} color="#047857" />
                    </div>
                    <div>
                        <div className={styles.statValue}>{stats.totalUsers}</div>
                        <div className={styles.statLabel}>Total Users</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#fef9c3' }}>
                        <Clock size={24} color="#854d0e" />
                    </div>
                    <div>
                        <div className={styles.statValue}>{stats.pendingShipments}</div>
                        <div className={styles.statLabel}>Pending</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#cffafe' }}>
                        <TrendingUp size={24} color="#0e7490" />
                    </div>
                    <div>
                        <div className={styles.statValue}>{stats.todayShipments}</div>
                        <div className={styles.statLabel}>Today</div>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h2>Recent Shipments</h2>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentShipments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className={styles.empty}>No shipments yet</td>
                                </tr>
                            ) : (
                                recentShipments.map((shipment) => (
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
