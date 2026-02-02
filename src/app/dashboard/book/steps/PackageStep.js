import { motion } from 'framer-motion';
import { Package, Truck, Info } from 'lucide-react';
import styles from '../page.module.css';

const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
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
            className={styles.formCard}
        >
            <div className={styles.stepTitle}>
                <Package size={22} className="text-primary" />
                Package & Service
            </div>

            <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                    <label>Weight (kg)</label>
                    <input
                        type="number"
                        name="weight"
                        step="0.1"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="1.0"
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Content Description</label>
                    <input
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="e.g. Books and Stationary"
                        required
                    />
                </div>

                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label>Choose Service</label>
                    <div className={styles.serviceGrid}>
                        {serviceTypes.map(type => (
                            <div
                                key={type.id}
                                className={`${styles.serviceOption} ${selectedService === type.id ? styles.selected : ''}`}
                                onClick={() => setSelectedService(type.id)}
                            >
                                <div className={styles.serviceInfo}>
                                    <h4>{type.name}</h4>
                                    <p>Fast and reliable delivery</p>
                                </div>
                                <div className={styles.servicePrice}>
                                    ₹ {(parseFloat(type.base_rate) + (parseFloat(formData.weight) * parseFloat(type.per_kg_rate))).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.estimateBox}>
                <div className={styles.estimateTitle}>Estimated Shipping Cost</div>
                <div className={styles.estimateValue}>
                    <span>₹</span>{calculateRate().toFixed(2)}
                </div>
                <div className="flex items-center justify-center" style={{ gap: '0.5rem', marginTop: '0.75rem', color: 'var(--gray-500)', fontSize: '0.75rem' }}>
                    <Info size={14} />
                    Final price may vary based on actual weight
                </div>
            </div>

            <div className={styles.buttonGroup}>
                <button
                    type="button"
                    onClick={onPrev}
                    className="btn btn-outline"
                    disabled={loading}
                >
                    Back
                </button>
                <button
                    type="submit"
                    onClick={onSubmit}
                    disabled={!isValid || loading}
                    className="btn btn-primary"
                >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
            </div>
        </motion.div>
    );
}

