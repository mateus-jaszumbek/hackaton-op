import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { IconButton } from '../ui/IconButton.jsx'
import { usePalette } from '../../theme/palette-context.js'
import { getMe } from '../../services/api.js'
import styles from './UserCard.module.css'

function initialsOf(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export function UserCard({ collapsed }) {
  const { pal, setPal } = usePalette()
  const isDark = pal === 'escuro'
  const [user, setUser] = useState(null)

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => {})
  }, [])

  return (
    <div className={styles.card} data-collapsed={collapsed}>
      <div className={styles.avatar}>{user ? initialsOf(user.name) : ''}</div>
      {!collapsed && (
        <div className={styles.info}>
          <div className={styles.name}>{user?.name ?? ''}</div>
          <div className={styles.role}>{user?.role ?? ''}</div>
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
