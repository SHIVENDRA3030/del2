import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import styles from '../page.module.css';

const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
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
            className={styles.stepContent}
        >
            <div className={styles.stepTitle}>
                <MapPin size={28} color="var(--primary)" strokeWidth={3} />
                Pickup Details
            </div>

            <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Sender Name</label>
                    <input
                        name="pickup_name"
                        value={formData.pickup_name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Phone Number</label>
                    <input
                        name="pickup_phone"
                        value={formData.pickup_phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        type="tel"
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.gridCols2}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Pincode</label>
                        <input
                            name="pickup_pincode"
                            value={formData.pickup_pincode}
                            onChange={handleChange}
                            placeholder="110001"
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>City</label>
                        <input
                            name="pickup_city"
                            value={formData.pickup_city}
                            onChange={handleChange}
                            placeholder="New Delhi"
                            className={styles.input}
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
                        placeholder="House no, Street, Area"
                        rows="3"
                        className={styles.input}
                        style={{ resize: 'none' }}
                        required
                    />
                </div>
            </div>

            <div className={styles.actions}>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isValid}
                    className="brutal-btn brutal-btn-primary w-full"
                >
                    Continue to Delivery
                </button>
            </div>
        </motion.div>
    );
}
