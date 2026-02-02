'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
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
                <h1 className="animate-reveal">Contact Us</h1>
                <p className="animate-reveal" style={{ animationDelay: '0.1s' }}>Have questions? We're here to help.</p>
            </div>

            <div className={`container ${styles.content}`}>
                <div className={`${styles.contactInfo} animate-reveal`} style={{ animationDelay: '0.2s' }}>
                    <h3>Get in Touch</h3>
                    <div className={styles.infoItem}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                            <Mail size={18} color="var(--primary)" strokeWidth={3} />
                            <strong>Email</strong>
                        </div>
                        <span>support@delhiveryclone.com</span>
                    </div>
                    <div className={styles.infoItem}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                            <Phone size={18} color="var(--primary)" strokeWidth={3} />
                            <strong>Phone</strong>
                        </div>
                        <span>1800-XXX-XXXX (Toll Free)</span>
                    </div>
                    <div className={styles.infoItem}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                            <MapPin size={18} color="var(--primary)" strokeWidth={3} />
                            <strong>Corporate Office</strong>
                        </div>
                        <span>Plot 5, Sector 44, Gurugram, Haryana 122003</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={`${styles.form} animate-reveal`} style={{ animationDelay: '0.3s' }}>
                    {success && (
                        <div className={styles.success}>
                            Thank you for reaching out! We'll get back to you soon.
                        </div>
                    )}
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>Full Name *</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Your Name"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Email Address *</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="your@email.com"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Phone Number</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 XXXXX XXXXX"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Company Name</label>
                            <input
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="e.g. Acme Corp"
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Your Message *</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder="How can we help you?"
                            rows="5"
                            className={styles.input}
                            style={{ resize: 'none' }}
                        />
                    </div>

                    <button type="submit" className="brutal-btn brutal-btn-primary w-full" disabled={loading} style={{ marginTop: '1.5rem' }}>
                        {loading ? 'Sending...' : 'Send Message'}
                        {!loading && <Send size={20} strokeWidth={3} />}
                    </button>
                </form>
            </div>
        </div>
    )
}
