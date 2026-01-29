'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './page.module.css'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)

    const supabase = createClient()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase
                .from('contact_submissions')
                .insert(formData)

            if (error) throw error

            setSuccess(true)
            setFormData({ name: '', email: '', phone: '', company: '', message: '' })
        } catch (err) {
            setError(err.message || 'Failed to submit. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Contact Us</h1>
                <p>Have questions? We're here to help.</p>
            </div>

            <div className={styles.content}>
                <div className={styles.contactInfo}>
                    <h3>Get in Touch</h3>
                    <div className={styles.infoItem}>
                        <strong>Email</strong>
                        <span>support@delhiveryclone.com</span>
                    </div>
                    <div className={styles.infoItem}>
                        <strong>Phone</strong>
                        <span>1800-XXX-XXXX (Toll Free)</span>
                    </div>
                    <div className={styles.infoItem}>
                        <strong>Address</strong>
                        <span>Plot 5, Sector 44, Gurugram, Haryana 122003</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {success && (
                        <div className={styles.success}>
                            Thank you for reaching out! We'll get back to you soon.
                        </div>
                    )}
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>Name *</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Your Name"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Email *</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="your@email.com"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Phone</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 XXXXX XXXXX"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Company</label>
                            <input
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Company Name"
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Message *</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder="How can we help you?"
                            rows="5"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </div>
    )
}
