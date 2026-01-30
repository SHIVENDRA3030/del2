import clsx from 'clsx';
import styles from './Button.module.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  className,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        styles.button,
        styles[variant],
        styles[`size-${size}`],
        disabled && styles.disabled,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
