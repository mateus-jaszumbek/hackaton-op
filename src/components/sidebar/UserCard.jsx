import { Moon, Sun } from 'lucide-react'
import { IconButton } from '../ui/IconButton.jsx'
import { usePalette } from '../../theme/palette-context.js'
import styles from './UserCard.module.css'

export function UserCard({ collapsed }) {
  const { pal, setPal } = usePalette()
  const isDark = pal === 'escuro'

  return (
    <div className={styles.card} data-collapsed={collapsed}>
      <div className={styles.avatar}>MA</div>
      {!collapsed && (
        <div className={styles.info}>
          <div className={styles.name}>Marina Almeida</div>
          <div className={styles.role}>Operações · perfil padrão</div>
        </div>
      )}
      <IconButton
        icon={isDark ? Moon : Sun}
        label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
        onClick={() => setPal(isDark ? 'menta' : 'escuro')}
      />
    </div>
  )
}
