import { Settings } from 'lucide-react'
import { IconButton } from '../ui/IconButton.jsx'
import styles from './UserCard.module.css'

export function UserCard({ collapsed }) {
  return (
    <div className={styles.card} data-collapsed={collapsed}>
      <div className={styles.avatar}>MA</div>
      {!collapsed && (
        <div className={styles.info}>
          <div className={styles.name}>Marina Almeida</div>
          <div className={styles.role}>Operações · perfil padrão</div>
        </div>
      )}
      <IconButton icon={Settings} label="Configurações" />
    </div>
  )
}
