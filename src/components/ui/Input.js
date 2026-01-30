import clsx from 'clsx';
import styles from './Input.module.css';

export const Input = ({
  type = 'text',
  size = 'md',
  error = false,
  disabled = false,
  className,
  ...props
}) => {
  return (
    <input
      type={type}
      disabled={disabled}
      className={clsx(
        styles.input,
        styles[`size-${size}`],
        error && styles.error,
        disabled && styles.disabled,
        className
      )}
      {...props}
    />
  );
};

export const Textarea = ({
  size = 'md',
  error = false,
  disabled = false,
  className,
  rows = 4,
  ...props
}) => {
  return (
    <textarea
      disabled={disabled}
      rows={rows}
      className={clsx(
        styles.textarea,
        styles[`size-${size}`],
        error && styles.error,
        disabled && styles.disabled,
        className
      )}
      {...props}
    />
  );
};

export default Input;
