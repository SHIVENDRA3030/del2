import { motion } from 'framer-motion';
import { MapPin, User, Phone } from 'lucide-react';
import styles from '../page.module.css';

const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
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
            className={styles.formCard}
        >
            <div className={styles.stepTitle}>
                <MapPin size={22} className="text-primary" />
                Pickup Details
            </div>

            <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                    <label>Sender Name</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            name="pickup_name"
                            value={formData.pickup_name}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                            required
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>Phone Number</label>
                    <input
                        name="pickup_phone"
                        value={formData.pickup_phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        type="tel"
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Pincode</label>
                    <input
                        name="pickup_pincode"
                        value={formData.pickup_pincode}
                        onChange={handleChange}
                        placeholder="110001"
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>City</label>
                    <input
                        name="pickup_city"
                        value={formData.pickup_city}
                        onChange={handleChange}
                        placeholder="New Delhi"
                        required
                    />
                </div>

                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label>Full Address</label>
                    <textarea
                        name="pickup_address"
                        value={formData.pickup_address}
                        onChange={handleChange}
                        placeholder="House no, Street, Area"
                        rows="3"
                        required
                    />
                </div>
            </div>

            <button
                type="button"
                onClick={handleNext}
                disabled={!isValid}
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
            >
                Next: Delivery Details
            </button>
        </motion.div>
    );
}
