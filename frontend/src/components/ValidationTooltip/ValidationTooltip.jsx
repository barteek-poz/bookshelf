import styles from './ValidationTooltip.module.css'
const ValidationTooltip = ({message}) => {
    return (
        <div className={styles.tooltipContainer}>
          <div className={styles.tooltipBox}>
            <span className={styles.message}>{message}</span>
            <div className={styles.arrow}></div>
          </div>
        </div>
      );
}

export default ValidationTooltip