import styles from './IconButton.module.css'

export function IconButton({ icon: Icon, label, size = 16, className = '', ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`${styles.btn} ${className}`}
      {...props}
    >
      <Icon size={size} />
    </button>
  )
}
