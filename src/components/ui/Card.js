import clsx from 'clsx';
import styles from './Card.module.css';

export const Card = ({ children, className, hoverable = false, ...props }) => {
  return (
    <div
      className={clsx(styles.card, hoverable && styles.hoverable, className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => (
  <div className={clsx(styles.header, className)} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className, ...props }) => (
  <div className={clsx(styles.body, className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div className={clsx(styles.footer, className)} {...props}>
    {children}
  </div>
);

export default Card;
