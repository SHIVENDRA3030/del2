'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Search, MapPin, CheckCircle, Truck, Package, XCircle } from 'lucide-react'
import styles from './page.module.css'

function TrackContent() {
    const searchParams = useSearchParams()
    const [awb, setAwb] = useState(searchParams.get('awb') || '')
    const [shipment, setShipment] = useState(null)
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const supabase = createClient()

    useEffect(() => {
        const awbParam = searchParams.get('awb')
        if (awbParam) {
            setAwb(awbParam)
            handleTrack(awbParam)
        }
    }, [searchParams])

    const handleTrack = async (trackingId) => {
        if (!trackingId) return

        setLoading(true)
        setError('')
        setShipment(null)

        try {
            let { data: shipmentData, error: shipmentError } = await supabase
                .from('shipments')
                .select('*')
                .eq('id', trackingId)
                .single()

            if (shipmentError) {
                throw new Error('Shipment not found. Please check your AWB/ID.')
            }

            setShipment(shipmentData)

            const { data: eventData, error: eventError } = await supabase
                .from('shipment_events')
                .select('*')
                .eq('shipment_id', trackingId)
                .order('created_at', { ascending: false })

            if (eventError) throw eventError

            setEvents(eventData)

        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to fetch tracking details')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        handleTrack(awb)
    }

    const getIcon = (status) => {
        switch (status) {
            case 'DELIVERED': return <CheckCircle size={24} />
            case 'IN_TRANSIT': return <Truck size={24} />
            case 'CANCELLED': return <XCircle size={24} />
            default: return <Package size={24} />
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Track Shipment</h1>

            <div className={styles.searchBox}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        value={awb}
                        onChange={(e) => setAwb(e.target.value)}
                        placeholder="Enter Tracking ID / AWB"
                        className={styles.input}
                        required
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Searching...' : 'Track'}
                    </button>
                </form>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {shipment && (
                <div className={styles.resultContainer}>
                    <div className={styles.resultHeader}>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>Shipment ID</div>
                            <div style={{ fontWeight: '700', fontSize: '1.2rem' }}>{shipment.id}</div>
                        </div>
                        <div className={`${styles.statusBadge} ${styles['status_' + (shipment.status || 'PENDING')]}`}>
                            {shipment.status || 'PENDING'}
                        </div>
                    </div>

                    <div className={styles.timeline}>
                        {events.length === 0 ? (
                            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-500)' }}>
                                No events recorded for this shipment yet.
                            </p>
                        ) : (
                            events.map((event, index) => (
                                <div key={event.id} className={styles.timelineItem}>
                                    <div className={styles.timelineLine}></div>
                                    <div className={`${styles.timelineIcon} ${index === 0 ? styles.active : ''}`}>
                                        {getIcon(event.status)}
                                    </div>
                                    <div className={styles.timelineContent}>
                                        <div className={styles.timelineStatus}>{event.status.replace('_', ' ')}</div>
                                        <div className={styles.timelineLocation}>
                                            {event.location && <><MapPin size={14} style={{ display: 'inline' }} /> {event.location}</>}
                                            {event.description && <div>{event.description}</div>}
                                        </div>
                                        <div className={styles.timelineDate}>
                                            {new Date(event.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default function TrackPage() {
    return (
        <Suspense fallback={<div className={styles.container}>Loading tracking...</div>}>
            <TrackContent />
        </Suspense>
    )
}
