import { motion } from 'framer-motion';
import { MapPin, User, Phone } from 'lucide-react';
import styles from '../page.module.css';

const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
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
            className={styles.formCard}
        >
            <div className={styles.stepTitle}>
                <MapPin size={22} className="text-primary" />
                Delivery Details
            </div>

            <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                    <label>Receiver Name</label>
                    <input
                        name="drop_name"
                        value={formData.drop_name}
                        onChange={handleChange}
                        placeholder="e.g. Jane Smith"
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Phone Number</label>
                    <input
                        name="drop_phone"
                        value={formData.drop_phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        type="tel"
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Pincode</label>
                    <input
                        name="drop_pincode"
                        value={formData.drop_pincode}
                        onChange={handleChange}
                        placeholder="400001"
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>City</label>
                    <input
                        name="drop_city"
                        value={formData.drop_city}
                        onChange={handleChange}
                        placeholder="Mumbai"
                        required
                    />
                </div>

                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label>Full Address</label>
                    <textarea
                        name="drop_address"
                        value={formData.drop_address}
                        onChange={handleChange}
                        placeholder="Flat no, Building, Street"
                        rows="3"
                        required
                    />
                </div>
            </div>

            <div className={styles.buttonGroup}>
                <button
                    type="button"
                    onClick={onPrev}
                    className="btn btn-outline"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isValid}
                    className="btn btn-primary"
                >
                    Next: Package Details
                </button>
            </div>
        </motion.div>
    );
}
