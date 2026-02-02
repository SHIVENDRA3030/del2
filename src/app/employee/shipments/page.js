'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Eye, X, MapPin, Package, Calendar } from 'lucide-react'
import styles from './page.module.css'

const STATUS_OPTIONS = ['PENDING', 'BOOKED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED']

export default function EmployeeShipmentsPage() {
    const [shipments, setShipments] = useState([])
    const [filteredShipments, setFilteredShipments] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedShipment, setSelectedShipment] = useState(null)
    const [viewingShipment, setViewingShipment] = useState(null)
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

            const { error: eventError } = await supabase
                .from('shipment_events')
                .insert({
                    shipment_id: selectedShipment.id,
                    status: newStatus,
                    description: `Status updated to ${newStatus}`,
                    location: 'Employee Update'
                })

            if (eventError) throw eventError

            setMessage({ type: 'success', text: 'Status updated successfully!' })
            setSelectedShipment(null)
            setNewStatus('')
            fetchShipments()
        } catch (err) {
            setMessage({ type: 'error', text: err.message })
            console.error(err)
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
