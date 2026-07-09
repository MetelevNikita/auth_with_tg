import { FC } from 'react'

// css

import styles from './MyInput.module.css'

// 

interface MyInputProps {
  title?: string
  placeholder?: string
  type?: string
  value?: string
  onChange: (e: any) => any
  onFocus?: (e: any) => any
}

const MyInput: FC<MyInputProps> = ({ title, placeholder, type, value, onChange, onFocus }) => {
  return (
    <div className={styles.input_wrapper}>
      <span className={styles.input_title}>{title}</span>
      <input type={type} className={styles.input} placeholder={placeholder} value={value} onChange={onChange} onFocus={onFocus}/>
    </div>
  )
}

export default MyInput