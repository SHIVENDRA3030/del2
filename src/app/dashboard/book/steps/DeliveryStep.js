import { motion } from 'framer-motion';
import styles from '../page.module.css';

const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
};

export default function DeliveryStep({ formData, handleChange, onPrev, onNext }) {
    const isValid = formData.drop_name && formData.drop_phone && formData.drop_pincode && formData.drop_city && formData.drop_address;

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
            <h2 className={styles.stepTitle}>Delivery Details</h2>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Receiver Name</label>
                <input
                    name="drop_name"
                    value={formData.drop_name}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="e.g. Jane Smith"
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Phone Number</label>
                <input
                    name="drop_phone"
                    value={formData.drop_phone}
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
                        name="drop_pincode"
                        value={formData.drop_pincode}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="400001"
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>City</label>
                    <input
                        name="drop_city"
                        value={formData.drop_city}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Mumbai"
                        required
                    />
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Full Address</label>
                <textarea
                    name="drop_address"
                    value={formData.drop_address}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Flat no, Building, Street"
                    rows="3"
                    required
                />
            </div>

            <div className={styles.buttonGroup}>
                <button
                    type="button"
                    onClick={onPrev}
                    className={styles.secondaryBtn}
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isValid}
                    className={styles.primaryBtn}
                >
                    Next Step
                </button>
            </div>
        </motion.div>
    );
}
