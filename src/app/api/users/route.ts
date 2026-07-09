import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'


export const GET = async () => {
  try {

    const users = await prisma.user.findMany()

    if (!users) {
      return NextResponse.json({
        success: false,
        message: 'Ошибка получения пользователей',
        data: null
      }, {status: 404})
    }

    if (users.length < 1) {
      return NextResponse.json({
        success: true,
        message: 'Список пуст',
        data: users
      }, {status: 200})
    }


    return NextResponse.json({
        success: false,
        message: 'Пользователи получены',
        data: users
      }, {status: 200})
    
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