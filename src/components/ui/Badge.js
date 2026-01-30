import clsx from 'clsx';
import styles from './Badge.module.css';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  return (
    <span
      className={clsx(
        styles.badge,
        styles[variant],
        styles[`size-${size}`],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
