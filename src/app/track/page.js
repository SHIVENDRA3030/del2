'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Search, MapPin, CheckCircle, Truck, Package, XCircle } from 'lucide-react'
import { Hero } from '@/components/layout/Hero'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
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
      const { data: shipmentData, error: shipmentError } = await supabase
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
      case 'DELIVERED':
        return <CheckCircle size={24} />
      case 'IN_TRANSIT':
        return <Truck size={24} />
      case 'CANCELLED':
        return <XCircle size={24} />
      default:
        return <Package size={24} />
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'success'
      case 'IN_TRANSIT':
        return 'primary'
      case 'CANCELLED':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <>
      <Hero
        title="Track Shipment"
        description="Enter your tracking ID to get real-time updates on your shipment."
        className={styles.heroOverride}
      >
        <div className={styles.searchBox}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              type="text"
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
              placeholder="Enter Tracking ID / AWB"
              size="md"
              required
            />
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Track'}
            </Button>
          </form>
        </div>
      </Hero>

      <div className={styles.container}>
        {error && <div className={styles.error}>{error}</div>}

        {shipment && (
          <div className={styles.resultContainer}>
            <div className={styles.resultHeader}>
              <div>
                <div className={styles.resultLabel}>Shipment ID</div>
                <div className={styles.resultId}>{shipment.id}</div>
              </div>
              <Badge
                variant={getStatusVariant(shipment.status || 'PENDING')}
                size="lg"
              >
                {shipment.status || 'PENDING'}
              </Badge>
            </div>

            <div className={styles.timeline}>
              {events.length === 0 ? (
                <p className={styles.noEvents}>
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
                      <div className={styles.timelineStatus}>
                        {event.status.replace(/_/g, ' ')}
                      </div>
                      <div className={styles.timelineLocation}>
                        {event.location && (
                          <>
                            <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            {event.location}
                          </>
                        )}
                        {event.description && (
                          <div className={styles.description}>{event.description}</div>
                        )}
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
    </>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className={styles.container}>Loading tracking...</div>}>
      <TrackContent />
    </Suspense>
  )
}
