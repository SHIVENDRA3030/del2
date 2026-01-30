import clsx from 'clsx';
import styles from './Hero.module.css';

export const Hero = ({
  title,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
  backgroundImage,
  children,
  className,
}) => {
  return (
    <section
      className={clsx(styles.hero, className)}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      <div className={styles.overlay} />
      <div className="container">
        <div className={styles.content}>
          {title && (
            <h1 className={styles.title}>
              {title}
            </h1>
          )}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {description && <p className={styles.description}>{description}</p>}

          {(primaryCta || secondaryCta) && (
            <div className={styles.ctaGroup}>
              {primaryCta && (
                <button className={clsx(styles.cta, styles.primary)}>
                  {primaryCta}
                </button>
              )}
              {secondaryCta && (
                <button className={clsx(styles.cta, styles.secondary)}>
                  {secondaryCta}
                </button>
              )}
            </div>
          )}

          {children}
        </div>
      </div>
    </section>
  );
};

export default Hero;
