import clsx from 'clsx';
import styles from './FeatureCard.module.css';

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  href,
  onClick,
  className,
  highlighted = false,
}) => {
  return (
    <div
      className={clsx(
        styles.card,
        highlighted && styles.highlighted,
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {Icon && (
        <div className={styles.iconWrapper}>
          <Icon className={styles.icon} size={32} />
        </div>
      )}

      <h3 className={styles.title}>{title}</h3>

      {description && <p className={styles.description}>{description}</p>}

      {href && (
        <a href={href} className={styles.link}>
          Learn More →
        </a>
      )}
    </div>
  );
};

export default FeatureCard;
