import { motion } from 'framer-motion';
import { Package, Info, Check } from 'lucide-react';
import styles from '../page.module.css';

const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
};

export default function PackageStep({
    formData,
    handleChange,
    serviceTypes,
    selectedService,
    setSelectedService,
    calculateRate,
    loading,
    onPrev,
    onSubmit
}) {
    const isValid = formData.weight && formData.description && selectedService;

    return (
        <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={styles.stepContent}
        >
            <div className={styles.stepTitle}>
                <Package size={28} color="var(--primary)" strokeWidth={3} />
                Package & Service
            </div>

            <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Weight (kg)</label>
                    <input
                        type="number"
                        name="weight"
                        step="0.1"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="1.0"
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Content Description</label>
                    <input
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="e.g. Books and Stationary"
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Choose Service</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {serviceTypes.map(type => (
                            <div
                                key={type.id}
                                className={`${styles.serviceOption} ${selectedService === type.id ? styles.selectedService : ''}`}
                                onClick={() => setSelectedService(type.id)}
                            >
                                <div>
                                    <div style={{ fontWeight: '800', fontFamily: 'Space Grotesk', textTransform: 'uppercase' }}>{type.name}</div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontWeight: '600' }}>Fast and reliable delivery</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: '900', color: 'var(--secondary)', fontSize: '1.125rem' }}>
                                        ₹ {(parseFloat(type.base_rate) + (parseFloat(formData.weight) * parseFloat(type.per_kg_rate))).toFixed(2)}
                                    </div>
                                    {selectedService === type.id && <Check size={16} color="var(--primary)" strokeWidth={3} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.rateCard} style={{ marginTop: '2.5rem' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', opacity: 0.8 }}>Total Shipping Cost</div>
                <div className={styles.rateValue}>
                    ₹ {calculateRate().toFixed(2)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.75rem', opacity: 0.7, fontWeight: '600' }}>
                    <Info size={14} strokeWidth={2.5} />
                    Final price based on actual weight at pickup
                </div>
            </div>

            <div className={styles.actions}>
                <button
                    type="button"
                    onClick={onPrev}
                    className="brutal-btn w-full"
                    disabled={loading}
                >
                    Back
                </button>
                <button
                    type="submit"
                    onClick={onSubmit}
                    disabled={!isValid || loading}
                    className="brutal-btn brutal-btn-primary w-full"
                >
                    {loading ? 'Processing...' : 'Book Now'}
                </button>
            </div>
        </motion.div>
    );
}
