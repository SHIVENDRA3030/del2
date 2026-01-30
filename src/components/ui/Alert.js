import clsx from 'clsx';
import styles from './Alert.module.css';

export const Alert = ({
  children,
  variant = 'info',
  title,
  onClose,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(styles.alert, styles[variant], className)}
      role="alert"
      {...props}
    >
      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.message}>{children}</div>
      </div>
      {onClose && (
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;
