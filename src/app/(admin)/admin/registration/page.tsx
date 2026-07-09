'use client'

import { FC, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Row, Col } from 'react-bootstrap'

// 

import MyInput from '@/components/UI/MyInput/MyInput'
import MyButton from '@/components/UI/MyButton/MyButton'



const page: FC = () => {

  const router = useRouter()

  const [user, setUser] = useState<any>(null)


  const [disabledBtn, setDisabledBtn] = useState<{disable: boolean, text: string}>({disable: false, text: 'Регистрация'})
  const [errorAuth, setErrorAuth] = useState<string | null>(null)
  const [resultHandler, setResultHandler] = useState<any>(null)

  async function createNewUserHandler (user: any) {
    try {
      setDisabledBtn({disable: true, text: 'Отправка данных'})

      const response = await fetch('/api/auth/registration', {
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

      if (!data.success) {
        setErrorAuth(data.message)
        return
      }

      console.log(data)
      setResultHandler(data)
      alert(data.message)
      
      router.push('/admin')
      return data
      
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        console.error(`Ошибка ${error.message}`)
        return `Ошибка`
      }

      console.error(error)
      return error
    }
  }




  return (
    <Container>
      <Row md={12} className='d-flex flex-md-row flex-column justify-content-center align-items-center'>
        <Col className='d-flex flex-md-row flex-column justify-content-center align-items-center mt-4'>
          <div>Регистрация</div>
        </Col>
      </Row>

      <Row md={12} className='d-flex flex-column justify-content-center align-items-center'>

        <Col md={6} className="mt-3">
          <MyInput
            type="text"
            placeholder="Имя Фамилия"
            value={user?.name || ''}
            onChange={(e: any) => setUser({...user, name: e.target.value})}
          />
        </Col>
        
        <Col md={6} className="mt-3">
          <MyInput
            type="email"
            placeholder="Почта для входа"
            value={user?.email || ''}
            onChange={(e: any) => setUser({...user, email: e.target.value})}
          />
        </Col>

        <Col md={6} className="mt-3">
          <MyInput
            type="text"
            placeholder="TelegramId: пример 00000000 (не имя пользователя) "
            value={user?.telegramId || ''}
            onChange={(e: any) => setUser({...user, telegramId: e.target.value})}
          />
        </Col>

        <Col md={6} className="mt-3">
          <MyInput
            type="text"
            placeholder="Логин под которым авторизуетесь на корп сайте"
            value={user?.loginCorp || ''}
            onChange={(e: any) => setUser({...user, loginCorp: e.target.value})}
          />
        </Col>

        <Col md={6} className="mt-3">
          <MyInput
            type="password"
            placeholder="Пароль не менее 6 симоволов"
            value={user?.password}
            onChange={
              (e: any) => setUser({...user, password: e.target.value})}
            />
        </Col>
      </Row>

      <Row md={12} className='d-flex flex-md-row flex-column justify-content-center align-items-center'>
        <Col md={3} sm={12} className="mt-3">
          <MyButton
            disabled={disabledBtn.disable}
            title={disabledBtn.text}
            onClick={() => {
              createNewUserHandler(user)
            }}
          />
        </Col>

        <Col md={3} sm={12} className="mt-3">
          <MyButton
            title="Назад"
            onClick={() => {
              router.push('/admin')
            }}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default page