'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AnimatePresence } from 'framer-motion'
import styles from './page.module.css'

// Import Steps
import PickupStep from './steps/PickupStep'
import DeliveryStep from './steps/DeliveryStep'
import PackageStep from './steps/PackageStep'

export default function BookShipment() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [currentStep, setCurrentStep] = useState(0)

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
            const { data, error } = await supabase.from('service_types').select('*').eq('is_active', true)
            if (data && data.length > 0) {
                setServiceTypes(data)
                setSelectedService(data[0].id)
            } else {
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

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 2))
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

    const handleSubmit = async (e) => {
        e?.preventDefault()
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
                    // Pickup Details
                    pickup_name: formData.pickup_name,
                    pickup_phone: formData.pickup_phone,
                    pickup_address: formData.pickup_address,
                    pickup_city: formData.pickup_city,
                    pickup_pincode: formData.pickup_pincode,
                    // Delivery Details
                    drop_name: formData.drop_name,
                    drop_phone: formData.drop_phone,
                    drop_address: formData.drop_address,
                    drop_city: formData.drop_city,
                    drop_pincode: formData.drop_pincode,
                    // Package Details
                    weight: parseFloat(formData.weight),
                    description: formData.description,
                    service_type: serviceTypes.find(s => s.id === selectedService)?.name || 'Standard',
                    estimated_rate: calculateRate()
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
            <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${((currentStep + 1) / 3) * 100}%` }}
                    ></div>
                </div>
                <div className={styles.stepIndicators}>
                    <span className={`${styles.stepIndicator} ${currentStep >= 0 ? styles.activeStepIndicator : ''}`}>Pickup</span>
                    <span className={`${styles.stepIndicator} ${currentStep >= 1 ? styles.activeStepIndicator : ''}`}>Delivery</span>
                    <span className={`${styles.stepIndicator} ${currentStep >= 2 ? styles.activeStepIndicator : ''}`}>Details</span>
                </div>
            </div>

            <h1 className={styles.mainTitle}>Book a Shipment</h1>

            {error && <div className="text-error mb-4 text-center bg-red-50 p-2 rounded text-sm text-red-600 border border-red-200">{error}</div>}

            <AnimatePresence mode="wait">
                {currentStep === 0 && (
                    <PickupStep
                        key="pickup"
                        formData={formData}
                        handleChange={handleChange}
                        onNext={nextStep}
                    />
                )}
                {currentStep === 1 && (
                    <DeliveryStep
                        key="delivery"
                        formData={formData}
                        handleChange={handleChange}
                        onPrev={prevStep}
                        onNext={nextStep}
                    />
                )}
                {currentStep === 2 && (
                    <PackageStep
                        key="package"
                        formData={formData}
                        handleChange={handleChange}
                        serviceTypes={serviceTypes}
                        selectedService={selectedService}
                        setSelectedService={setSelectedService}
                        calculateRate={calculateRate}
                        loading={loading}
                        onPrev={prevStep}
                        onSubmit={handleSubmit}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
