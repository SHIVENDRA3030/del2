'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Hero } from '@/components/layout/Hero'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
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
    <>
      <Hero
        title="Contact Us"
        description="Have questions? We're here to help. Get in touch with our team."
        className={styles.heroOverride}
      />

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.contactInfo}>
            <h3 className={styles.infoTitle}>Get in Touch</h3>
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
              <Alert variant="success" title="Message Sent!">
                Thank you for reaching out! We'll get back to you soon.
              </Alert>
            )}
            {error && (
              <Alert variant="error" title="Error">
                {error}
              </Alert>
            )}

            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>Name *</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  size="md"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>Email *</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  size="md"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="phone" className={styles.label}>Phone</label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  size="md"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="company" className={styles.label}>Company</label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company Name"
                  size="md"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="message" className={styles.label}>Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                rows="5"
                required
                className={styles.textarea}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
