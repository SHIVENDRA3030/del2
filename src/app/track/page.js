'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Search, MapPin, CheckCircle, Truck, Package, XCircle, ArrowRight, Calendar } from 'lucide-react'
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
            case 'DELIVERED': return <CheckCircle size={28} strokeWidth={3} />
            case 'IN_TRANSIT': return <Truck size={28} strokeWidth={3} />
            case 'CANCELLED': return <XCircle size={28} strokeWidth={3} />
            default: return <Package size={28} strokeWidth={3} />
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={`${styles.title} animate-reveal`}>Track Order</h1>

            <div className={`${styles.searchBox} animate-reveal`} style={{ animationDelay: '0.1s' }}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        value={awb}
                        onChange={(e) => setAwb(e.target.value)}
                        placeholder="Waybill / AWB Number"
                        className={styles.input}
                        required
                    />
                    <button type="submit" className="brutal-btn brutal-btn-primary" disabled={loading}>
                        {loading ? 'Searching...' : 'Track Now'}
                    </button>
                </form>
            </div>

            {error && <div className={`${styles.error} animate-reveal`}>{error}</div>}

            {shipment && (
                <div className={`${styles.resultContainer} animate-reveal`} style={{ animationDelay: '0.2s' }}>
                    <div className={styles.resultHeader}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Shipment ID</div>
                            <div style={{ fontWeight: '900', fontSize: '1.5rem', fontFamily: 'Space Grotesk', color: 'var(--secondary)' }}>{shipment.id}</div>
                        </div>
                        <div className={`${styles.statusBadge} ${styles['status_' + (shipment.status || 'PENDING')]}`}>
                            {shipment.status || 'PENDING'}
                        </div>
                    </div>

                    <div className={styles.timeline}>
                        {events.length === 0 ? (
                            <div className="text-center" style={{ padding: '3rem' }}>
                                <p style={{ fontWeight: '700', color: 'var(--gray-400)' }}>
                                    Initial processing started. Check back soon.
                                </p>
                            </div>
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
                                            {event.location && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                    <MapPin size={16} strokeWidth={2.5} color="var(--primary)" />
                                                    {event.location}
                                                </div>
                                            )}
                                            {event.description && <div style={{ fontSize: '0.9375rem', lineHeight: '1.4' }}>{event.description}</div>}
                                        </div>
                                        <div className={styles.timelineDate}>
                                            <Calendar size={14} style={{ marginRight: '0.5rem', display: 'inline' }} />
                                            {new Date(event.created_at).toLocaleString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
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
