import { NextResponse, NextRequest } from "next/server"
import { prisma } from '@/lib/prisma'


export const DELETE = async (req: NextRequest, { params }: {params: {id: string}}) => {
  try {


    const { id } = await params
    console.log('ID', id)

    const findUser = await prisma.user.findFirst({
      where: {
        id: parseInt(id)
      }
    })

    if (!findUser) {
      return NextResponse.json({
        success: false,
        message: 'Пользователь не найден',
        data: 'User not find'
      })
    }

    const deleteUser = await prisma.user.delete({
      where: {
        id: parseInt(id)
      }
    })

    return NextResponse.json({
        success: true,
        message: `Пользователь ${findUser.id} - ${findUser.name} удален`,
        data: 'User was deleted'
      })
    
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      console.error(`Ошибка удаления ${error.message}`)
      return NextResponse.json({
        success: false,
        message: 'Ошибка удаления пользователя',
        data: null
      }, {status: 500})
    }
  }
}