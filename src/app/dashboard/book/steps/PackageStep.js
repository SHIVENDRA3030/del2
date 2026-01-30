import { motion } from 'framer-motion';
import styles from '../page.module.css';

const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
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
            className={styles.stepContainer}
        >
            <h2 className={styles.stepTitle}>Package & Service</h2>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Weight (kg)</label>
                <input
                    type="number"
                    name="weight"
                    step="0.1"
                    value={formData.weight}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="1.0"
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Content Description</label>
                <input
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="e.g. Books and Stationary"
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Service Type</label>
                <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className={styles.select}
                >
                    {serviceTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                </select>
            </div>

            <div className={styles.estimatedRate}>
                <div className={styles.rateLabel}>Estimated Cost</div>
                <div className={styles.rateAmount}>₹ {calculateRate().toFixed(2)}</div>
            </div>

            <div className={styles.buttonGroup}>
                <button
                    type="button"
                    onClick={onPrev}
                    className={styles.secondaryBtn}
                    disabled={loading}
                >
                    Back
                </button>
                <button
                    type="submit"
                    onClick={onSubmit}
                    disabled={!isValid || loading}
                    className={styles.submitBtn}
                >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
            </div>
        </motion.div>
    );
}
