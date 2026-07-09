'use client'

// style

import styles from './page.module.css'

import { FC, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Row, Col } from 'react-bootstrap'

// 

import MyInput from '@/components/UI/MyInput/MyInput'
import MyButton from '@/components/UI/MyButton/MyButton'

const page: FC = () => {

  const router = useRouter()

  const [user, setUser] = useState<any>(null)

  const [errorAuth, setErrorAuth] = useState<string | null>(null)
  const [resultHandler, setResultHandler] = useState<any>(null)


  async function handleLogin(user: {email: string, password: string}) {
    
    try {

      if (!user) {
        setErrorAuth('Поля не должны быть заполнены')
        console.log('Поля пустые')
        return
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(user)
      })

      if (!response.ok) {
        throw new Error(`Сетевая ошибка ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      console.log(data)

      if (!data.success) {
        setErrorAuth(data.message)
        return data.message
      }
      setResultHandler(data.message)
      setTimeout(() => {
          router.push('/')
      }, 2000)
      
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        console.log(`Ошибка ${error.message}`)
        return `Ошибка`
      } 

      console.error(error)
      return error
    }
  }



  return (
    <Container>
      <Row md={12} className='d-flex flex-column justify-content-center align-items-center'>
        <Col className='d-flex flex-column justify-content-center align-items-center mt-4'>
          <div>Войти</div>
        </Col>
      </Row>

      <Row md={12} className='d-flex flex-column justify-content-center align-items-center'>
        
        <Col md={6} className="mt-3">
          <MyInput
            type="email"
            placeholder="Email"
            value={user?.email || ''}
            onChange={
              (e: any) => setUser({...user, email: e.target.value})
            }
            onFocus={() => {
              setErrorAuth(null)
            }}
          />
        </Col>

        <Col md={6} className="mt-2">
          <MyInput
            type="password"
            placeholder="Password"
            value={user?.password || ''}
            onChange={
              (e: any) => setUser({...user, password: e.target.value})
            }
            onFocus={() => {
              setErrorAuth(null)
            }}
            />
        </Col>
      </Row>

      {
        (errorAuth) && (
          <Row md={12} className='d-flex flex-md-row flex-column justify-content-center align-items-center'>
            <Col className='d-flex flex-md-row flex-column justify-content-center align-items-center mt-2 mb-2'>

              <div className={styles.error_field}>Ошибка: {errorAuth}</div>
            
            </Col>
          </Row>
        )
      }


      {
        (resultHandler) && (
          <Row md={12} className='d-flex flex-md-row flex-column justify-content-center align-items-center'>
            <Col className='d-flex flex-md-row flex-column justify-content-center align-items-center mt-2 mb-2'>

              <div className={styles.result_field}>{resultHandler}</div>
            
            </Col>
          </Row>
        )
      }

      <Row md={6} className='d-flex flex-md-row flex-column justify-content-center align-items-center'>
        <Col md={3} className="mt-2">
          <MyButton
            title="Войти"
            onClick={() => {
              handleLogin(user)
            }}
          />
        </Col>

        <Col md={3} className="mt-2">
          <MyButton
            title="Регистрация"
            onClick={() => {
              router.push('/admin/registration')
            }}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default page