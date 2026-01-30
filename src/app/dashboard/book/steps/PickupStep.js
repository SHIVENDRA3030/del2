import { motion } from 'framer-motion';
import styles from '../page.module.css';

const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
};

export default function PickupStep({ formData, handleChange, onNext }) {
    const isValid = formData.pickup_name && formData.pickup_phone && formData.pickup_pincode && formData.pickup_city && formData.pickup_address;

    const handleNext = (e) => {
        e.preventDefault();
        if (isValid) onNext();
    };

    return (
        <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={styles.stepContainer}
        >
            <h2 className={styles.stepTitle}>Pickup Details</h2>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Sender Name</label>
                <input
                    name="pickup_name"
                    value={formData.pickup_name}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="e.g. John Doe"
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Phone Number</label>
                <input
                    name="pickup_phone"
                    value={formData.pickup_phone}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="+91 98765 43210"
                    type="tel"
                    required
                />
            </div>

            <div className={styles.row}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Pincode</label>
                    <input
                        name="pickup_pincode"
                        value={formData.pickup_pincode}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="110001"
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>City</label>
                    <input
                        name="pickup_city"
                        value={formData.pickup_city}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="New Delhi"
                        required
                    />
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Full Address</label>
                <textarea
                    name="pickup_address"
                    value={formData.pickup_address}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="House no, Street, Area"
                    rows="3"
                    required
                />
            </div>

            <button
                type="button"
                onClick={handleNext}
                disabled={!isValid}
                className={styles.primaryBtn}
            >
                Next Step
            </button>
        </motion.div>
    );
}
