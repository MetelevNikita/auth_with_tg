import { FC } from 'react'

// 

import styles from './MyButton.module.css'

// 

interface MyButtonProps {
  title: string
  disabled?: boolean
  onClick: () => any
}

const MyButton: FC<MyButtonProps> = ({ title, disabled = false, onClick }) => {
  return (
    <button className={styles.button} onClick={onClick} disabled={disabled}>
      {title}
    </button>
  )
}

export default MyButton