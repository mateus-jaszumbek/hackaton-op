import { forwardRef } from 'react'
import { Search } from 'lucide-react'
import styles from './SearchBox.module.css'

export const SearchBox = forwardRef(function SearchBox({ value, onChange }, ref) {
  return (
    <div className={styles.box}>
      <Search size={15} className={styles.icon} />
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar conversas"
        aria-label="Buscar conversas"
        className={styles.input}
      />
    </div>
  )
})
