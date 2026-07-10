import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'



export const POST = async (req: NextRequest) => {
  try {

    const {email, password} = await req.json()

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Поля не должны быть пустыми',
        data: 'Empty field'
      })
    }

    // 

    const authUser = await prisma.user.findFirst({
      where: {
        email: email
      }
    })

    if (!authUser) {
      return NextResponse.json({
        success: false,
        message: 'Пользователь с такой почтой не зарегестрирован',
        data: 'User not Found'
      })
    }



    const comparePassword = await bcrypt.compare(password, authUser.password)
    console.log('Валидация пароля ', comparePassword)


    if (!comparePassword) {
      return NextResponse.json({
        success: false,
        message: 'Неверный пароль',
        data: 'User not Found'
      })
    }

    

    if (!authUser.сonfirmed) {
      return NextResponse.json({
        success: false,
        message: 'Пользователь еще не авторизован в системе',
        data: 'User not confirmed'
      })
    }

    const token = jwt.sign({email: authUser.email}, process.env.JWT_SECRET as string, { expiresIn: '1h' })

    const res = NextResponse.json({
      success: true,
      message: 'Пользователь успешно авторизован',
      data: 'User Found'
    })

    res.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    })

    return res
    
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      console.error(`Ошибка авторизации ${error.message}`)
      return NextResponse.json({
        success: false,
        message: 'Ошибка автризации пользователя',
        data: null
      }, {status: 500})
    }
  }
}


