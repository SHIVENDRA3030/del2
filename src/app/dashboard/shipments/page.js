'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import styles from './page.module.css'

export default function ShipmentsPage() {
    const [shipments, setShipments] = useState([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchShipments() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const { data, error } = await supabase
                    .from('shipments')
                    .select('*, shipment_addresses(*)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })

                if (error) throw error
                setShipments(data || [])
            } catch (err) {
                console.error('Error fetching shipments:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchShipments()
    }, [])

    if (loading) return <div className={styles.loading}>Loading shipments...</div>

    return (
        <div>
            <div className={styles.header}>
                <h1>My Shipments</h1>
                <Link href="/dashboard/book" className="btn btn-primary">
                    + New Shipment
                </Link>
            </div>

            {shipments.length === 0 ? (
                <div className={styles.empty}>
                    <p>You haven't created any shipments yet.</p>
                    <Link href="/dashboard/book" className="btn btn-primary">
                        Book Your First Shipment
                    </Link>
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Shipment ID</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shipments.map((shipment) => (
                                <tr key={shipment.id}>
                                    <td className={styles.idCell}>{shipment.id}</td>
                                    <td>{new Date(shipment.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`${styles.status} ${styles['status_' + (shipment.status || 'PENDING')]}`}>
                                            {shipment.status || 'PENDING'}
                                        </span>
                                    </td>
                                    <td>
                                        <Link href={`/track?awb=${shipment.id}`} className={styles.trackLink}>
                                            Track
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
