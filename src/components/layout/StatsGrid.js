import clsx from 'clsx';
import styles from './StatsGrid.module.css';

export const StatsGrid = ({ stats, title, className }) => {
  return (
    <section className={clsx(styles.section, className)}>
      <div className="container">
        {title && <h2 className={styles.title}>{title}</h2>}

        <div className={styles.grid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
              {stat.description && (
                <p className={styles.description}>{stat.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsGrid;
