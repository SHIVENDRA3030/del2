'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Eye, X, MapPin, Package, User, Phone, Calendar } from 'lucide-react'
import styles from './page.module.css'

const STATUS_OPTIONS = ['PENDING', 'BOOKED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']

export default function AdminShipmentsPage() {
    const [shipments, setShipments] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedShipment, setSelectedShipment] = useState(null)
    const [viewingShipment, setViewingShipment] = useState(null)
    const [newStatus, setNewStatus] = useState('')
    const [updating, setUpdating] = useState(false)
    const [message, setMessage] = useState(null)
    const supabase = createClient()

    useEffect(() => {
        fetchShipments()
    }, [])

    async function fetchShipments() {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('shipments')
                .select('*, user_profiles(full_name, id)')
                .order('created_at', { ascending: false })

            if (error) throw error
            setShipments(data || [])
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
            // Update shipment status
            const { error: updateError } = await supabase
                .from('shipments')
                .update({ status: newStatus })
                .eq('id', selectedShipment.id)

            if (updateError) throw updateError

            // Add shipment event
            await supabase
                .from('shipment_events')
                .insert({
                    shipment_id: selectedShipment.id,
                    status: newStatus,
                    description: `Status updated to ${newStatus}`,
                    location: 'Admin Update'
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

            {selectedShipment && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>Update Status for {selectedShipment.id.slice(0, 8)}...</h3>
                        <p>Current status: <strong>{selectedShipment.status}</strong></p>

                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">Select new status</option>
                            {STATUS_OPTIONS.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        <div className={styles.modalActions}>
                            <button
                                className="btn btn-primary"
                                onClick={handleStatusUpdate}
                                disabled={!newStatus || updating}
                            >
                                {updating ? 'Updating...' : 'Update Status'}
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

            {/* View Details Modal */}
            {viewingShipment && (
                <div className={styles.modal}>
                    <div className={styles.detailsModal}>
                        <div className={styles.detailsHeader}>
                            <h3>Order Details</h3>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setViewingShipment(null)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.detailsBody}>
                            {/* Order Info */}
                            <div className={styles.detailsSection}>
                                <div className={styles.sectionTitle}>
                                    <Calendar size={18} />
                                    Order Information
                                </div>
                                <div className={styles.detailsGrid}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Shipment ID</span>
                                        <span className={styles.detailValue}>{viewingShipment.id}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Status</span>
                                        <span className={`${styles.status} ${styles['status_' + viewingShipment.status]}`}>
                                            {viewingShipment.status}
                                        </span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Created</span>
                                        <span className={styles.detailValue}>{new Date(viewingShipment.created_at).toLocaleString()}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Customer</span>
                                        <span className={styles.detailValue}>{viewingShipment.user_profiles?.full_name || 'Unknown'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Pickup Details */}
                            <div className={styles.detailsSection}>
                                <div className={styles.sectionTitle}>
                                    <MapPin size={18} />
                                    Pickup Details
                                </div>
                                <div className={styles.detailsGrid}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Name</span>
                                        <span className={styles.detailValue}>{viewingShipment.pickup_name || '-'}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Phone</span>
                                        <span className={styles.detailValue}>{viewingShipment.pickup_phone || '-'}</span>
                                    </div>
                                    <div className={styles.detailItem + ' ' + styles.fullWidth}>
                                        <span className={styles.detailLabel}>Address</span>
                                        <span className={styles.detailValue}>
                                            {viewingShipment.pickup_address || '-'}, {viewingShipment.pickup_city || ''} - {viewingShipment.pickup_pincode || ''}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Details */}
                            <div className={styles.detailsSection}>
                                <div className={styles.sectionTitle}>
                                    <MapPin size={18} />
                                    Delivery Details
                                </div>
                                <div className={styles.detailsGrid}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Name</span>
                                        <span className={styles.detailValue}>{viewingShipment.drop_name || '-'}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Phone</span>
                                        <span className={styles.detailValue}>{viewingShipment.drop_phone || '-'}</span>
                                    </div>
                                    <div className={styles.detailItem + ' ' + styles.fullWidth}>
                                        <span className={styles.detailLabel}>Address</span>
                                        <span className={styles.detailValue}>
                                            {viewingShipment.drop_address || '-'}, {viewingShipment.drop_city || ''} - {viewingShipment.drop_pincode || ''}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Package Details */}
                            <div className={styles.detailsSection}>
                                <div className={styles.sectionTitle}>
                                    <Package size={18} />
                                    Package Details
                                </div>
                                <div className={styles.detailsGrid}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Weight</span>
                                        <span className={styles.detailValue}>{viewingShipment.weight || '-'} kg</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Service Type</span>
                                        <span className={styles.detailValue}>{viewingShipment.service_type || '-'}</span>
                                    </div>
                                    <div className={styles.detailItem + ' ' + styles.fullWidth}>
                                        <span className={styles.detailLabel}>Description</span>
                                        <span className={styles.detailValue}>{viewingShipment.description || '-'}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Estimated Rate</span>
                                        <span className={styles.detailValue}>₹ {viewingShipment.estimated_rate || '0'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.detailsFooter}>
                            <button
                                className="btn btn-outline"
                                onClick={() => setViewingShipment(null)}
                            >
                                Close
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
                            <th>User</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shipments.length === 0 ? (
                            <tr>
                                <td colSpan="5" className={styles.empty}>No shipments found</td>
                            </tr>
                        ) : (
                            shipments.map((shipment) => (
                                <tr key={shipment.id}>
                                    <td className={styles.idCell}>{shipment.id.slice(0, 12)}...</td>
                                    <td>{shipment.user_profiles?.full_name || 'Unknown'}</td>
                                    <td>
                                        <span className={`${styles.status} ${styles['status_' + shipment.status]}`}>
                                            {shipment.status}
                                        </span>
                                    </td>
                                    <td>{new Date(shipment.created_at).toLocaleString()}</td>
                                    <td className={styles.actionBtns}>
                                        <button
                                            className={styles.viewBtn}
                                            onClick={() => setViewingShipment(shipment)}
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </button>
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
