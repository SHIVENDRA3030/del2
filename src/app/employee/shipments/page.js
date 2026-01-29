'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search } from 'lucide-react'
import styles from './page.module.css'

const STATUS_OPTIONS = ['PENDING', 'BOOKED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']

export default function EmployeeShipmentsPage() {
    const [shipments, setShipments] = useState([])
    const [filteredShipments, setFilteredShipments] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedShipment, setSelectedShipment] = useState(null)
    const [newStatus, setNewStatus] = useState('')
    const [updating, setUpdating] = useState(false)
    const [message, setMessage] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const supabase = createClient()

    useEffect(() => {
        fetchShipments()
    }, [])

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredShipments(shipments)
        } else {
            const query = searchQuery.toLowerCase()
            setFilteredShipments(
                shipments.filter(s =>
                    s.id.toLowerCase().includes(query) ||
                    s.user_profiles?.full_name?.toLowerCase().includes(query) ||
                    s.status?.toLowerCase().includes(query)
                )
            )
        }
    }, [searchQuery, shipments])

    async function fetchShipments() {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('shipments')
                .select('*, user_profiles(full_name)')
                .order('created_at', { ascending: false })

            if (error) throw error
            setShipments(data || [])
            setFilteredShipments(data || [])
        } catch (err) {
            console.error('Error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async () => {
        if (!selectedShipment || !newStatus) return

        setUpdating(true)
        setMessage(null)

        try {
            const { error: updateError } = await supabase
                .from('shipments')
                .update({ status: newStatus })
                .eq('id', selectedShipment.id)

            if (updateError) throw updateError

            await supabase
                .from('shipment_events')
                .insert({
                    shipment_id: selectedShipment.id,
                    status: newStatus,
                    description: `Status updated to ${newStatus}`,
                    location: 'Employee Update'
                })

            setMessage({ type: 'success', text: 'Status updated successfully!' })
            setSelectedShipment(null)
            setNewStatus('')
            fetchShipments()
        } catch (err) {
            setMessage({ type: 'error', text: err.message })
        } finally {
            setUpdating(false)
        }
    }

    if (loading) return <div className={styles.loading}>Loading shipments...</div>

    return (
        <div>
            <h1 className={styles.title}>Manage Shipments</h1>

            {message && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            <div className={styles.searchContainer}>
                <Search size={18} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search by ID, customer, or status..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                />
                <span className={styles.resultCount}>{filteredShipments.length} shipments</span>
            </div>

            {selectedShipment && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>Update Status</h3>
                        <p>Shipment: {selectedShipment.id.slice(0, 12)}...</p>
                        <p>Current: <strong>{selectedShipment.status}</strong></p>

                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">Select new status</option>
                            {STATUS_OPTIONS.map(status => (
                                <option key={status} value={status}>{status.replace('_', ' ')}</option>
                            ))}
                        </select>

                        <div className={styles.modalActions}>
                            <button
                                className="btn btn-primary"
                                onClick={handleStatusUpdate}
                                disabled={!newStatus || updating}
                            >
                                {updating ? 'Updating...' : 'Update'}
                            </button>
                            <button
                                className="btn btn-outline"
                                onClick={() => { setSelectedShipment(null); setNewStatus(''); }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Shipment ID</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredShipments.length === 0 ? (
                            <tr>
                                <td colSpan="5" className={styles.empty}>No shipments found</td>
                            </tr>
                        ) : (
                            filteredShipments.map((shipment) => (
                                <tr key={shipment.id}>
                                    <td className={styles.idCell}>{shipment.id.slice(0, 12)}...</td>
                                    <td>{shipment.user_profiles?.full_name || 'Unknown'}</td>
                                    <td>
                                        <span className={`${styles.status} ${styles['status_' + shipment.status]}`}>
                                            {shipment.status}
                                        </span>
                                    </td>
                                    <td>{new Date(shipment.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => setSelectedShipment(shipment)}
                                        >
                                            Update Status
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
