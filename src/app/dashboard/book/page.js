'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import styles from './page.module.css'

export default function BookShipment() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Service types
    const [serviceTypes, setServiceTypes] = useState([])
    const [selectedService, setSelectedService] = useState('')

    // Form states
    const [formData, setFormData] = useState({
        pickup_name: '',
        pickup_phone: '',
        pickup_address: '',
        pickup_pincode: '',
        pickup_city: '',
        drop_name: '',
        drop_phone: '',
        drop_address: '',
        drop_pincode: '',
        drop_city: '',
        weight: '1',
        description: 'General Merchandise'
    })

    useEffect(() => {
        // Fetch service types
        async function fetchServices() {
            // Mock data if table empty or fetch real
            const { data, error } = await supabase.from('service_types').select('*').eq('is_active', true)
            if (data && data.length > 0) {
                setServiceTypes(data)
                setSelectedService(data[0].id)
            } else {
                // Fallback default
                setServiceTypes([{ id: 'default', name: 'Standard Express', base_rate: 50, per_kg_rate: 20 }]);
                setSelectedService('default')
            }
        }
        fetchServices()
    }, [])

    const calculateRate = () => {
        const service = serviceTypes.find(s => s.id === selectedService) || serviceTypes[0]
        if (!service) return 0
        const weight = parseFloat(formData.weight) || 1
        const base = parseFloat(service.base_rate || 50)
        const perKg = parseFloat(service.per_kg_rate || 20)
        return base + (weight * perKg)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('You must be logged in to book a shipment')

            // 1. Create Shipment
            const { data: shipment, error: shipmentError } = await supabase
                .from('shipments')
                .insert({
                    user_id: user.id,
                    status: 'PENDING',
                    // service_type_id: selectedService // Assuming column exists or we add metadata
                })
                .select()
                .single()

            if (shipmentError) throw shipmentError

            // 2. Create Addresses (Origin & Destination)
            const addresses = [
                {
                    shipment_id: shipment.id,
                    type: 'pickup',
                    name: formData.pickup_name,
                    phone: formData.pickup_phone,
                    address_line1: formData.pickup_address,
                    city: formData.pickup_city,
                    pincode: formData.pickup_pincode,
                    country: 'India'
                },
                {
                    shipment_id: shipment.id,
                    type: 'delivery',
                    name: formData.drop_name,
                    phone: formData.drop_phone,
                    address_line1: formData.drop_address,
                    city: formData.drop_city,
                    pincode: formData.drop_pincode,
                    country: 'India'
                }
            ]

            const { error: addrError } = await supabase.from('shipment_addresses').insert(addresses)
            if (addrError) throw addrError

            // 3. Create Shipment Item
            const { error: itemError } = await supabase.from('shipment_items').insert({
                shipment_id: shipment.id,
                description: formData.description,
                weight_kg: parseFloat(formData.weight),
                quantity: 1
            })
            if (itemError) throw itemError

            // 4. Create Initial Event
            await supabase.from('shipment_events').insert({
                shipment_id: shipment.id,
                status: 'PENDING',
                description: 'Shipment booked successfully',
                location: 'Online'
            })

            // Redirect to dashboard
            router.push('/dashboard')
            router.refresh()

        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to book shipment')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Book a Shipment</h1>

            {error && <div className="text-error mb-4 text-center">{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* Pickup Details */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Pickup Details</h2>
                    <div className={styles.grid}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Sender Name</label>
                            <input name="pickup_name" value={formData.pickup_name} onChange={handleChange} className={styles.input} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Phone Number</label>
                            <input name="pickup_phone" value={formData.pickup_phone} onChange={handleChange} className={styles.input} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Pincode</label>
                            <input name="pickup_pincode" value={formData.pickup_pincode} onChange={handleChange} className={styles.input} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>City</label>
                            <input name="pickup_city" value={formData.pickup_city} onChange={handleChange} className={styles.input} required />
                        </div>
                        <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                            <label className={styles.label}>Address</label>
                            <textarea name="pickup_address" value={formData.pickup_address} onChange={handleChange} className={styles.input} required rows="2" />
                        </div>
                    </div>
                </div>

                {/* Drop Details */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Delivery Details</h2>
                    <div className={styles.grid}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Receiver Name</label>
                            <input name="drop_name" value={formData.drop_name} onChange={handleChange} className={styles.input} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Phone Number</label>
                            <input name="drop_phone" value={formData.drop_phone} onChange={handleChange} className={styles.input} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Pincode</label>
                            <input name="drop_pincode" value={formData.drop_pincode} onChange={handleChange} className={styles.input} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>City</label>
                            <input name="drop_city" value={formData.drop_city} onChange={handleChange} className={styles.input} required />
                        </div>
                        <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                            <label className={styles.label}>Address</label>
                            <textarea name="drop_address" value={formData.drop_address} onChange={handleChange} className={styles.input} required rows="2" />
                        </div>
                    </div>
                </div>

                {/* Package Details */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Package & Service</h2>
                    <div className={styles.grid}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Weight (kg)</label>
                            <input type="number" name="weight" step="0.1" value={formData.weight} onChange={handleChange} className={styles.input} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Content Description</label>
                            <input name="description" value={formData.description} onChange={handleChange} className={styles.input} required />
                        </div>
                        <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                            <label className={styles.label}>Service Type</label>
                            <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className={styles.select}>
                                {serviceTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.estimatedRate}>
                        <div className={styles.rateLabel}>Estimated Shipping Cost</div>
                        <div className={styles.rateAmount}>₹ {calculateRate().toFixed(2)}</div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="button" className={styles.cancelBtn} onClick={() => router.back()}>Cancel</button>
                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Processing...' : 'Confirm Booking'}
                    </button>
                </div>
            </form>
        </div>
    )
}
