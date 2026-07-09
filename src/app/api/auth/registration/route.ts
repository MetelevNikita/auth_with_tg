import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'

// telegramBot

import { telegramBotAuth } from "@/lib/telegramBotAdmin";
import { telegramBotApp } from "@/lib/telegramBotApp";

// 

import { prisma } from '../../../../lib/prisma'



export const POST = async (req: NextRequest) => {
  try {

    const TOKEN_Auth = process.env.TOKEN_AUTH 
    const TOKEN_App = process.env.TOKEN_APP

    const botAuth = await telegramBotAuth(TOKEN_Auth as string)
    const botApp = await telegramBotApp(TOKEN_App as string)

    const {name, email, telegramId, loginCorp, password} = await req.json()

    console.log(name, email, telegramId, loginCorp, password)

    if (!name || !email || !telegramId || !loginCorp || !password) {
      return NextResponse.json({
        success: false,
        message: 'Field Empty',
        data: 'Field Empty'
      }, {status: 404})
    }

    // hash password

    const hashPassword = await bcrypt.hash(password, 10)

    // 


    const userObject = {
      name: name,
      email: email,
      telegramId: telegramId,
      password: hashPassword,
      loginCorp: loginCorp,
      сonfirmed: false,
      admin: false
    }

    const newUser =await prisma.user.create({
      data: userObject
    })

    console.log(newUser)

    // send to user

    await botApp.sendMessage(telegramId, '<b>Вы успешно прошли регистрацию на сайте pr-tz.ru</b>\n\nУведомление о получения разрешения на вход в систему придет в телеграм боте', {parse_mode: 'HTML'})

    // 

    await botAuth.sendMessage(
      '-1004463734011',
      `<b>Заявка на регистрацию</b>\n\nНовый пользователь\n\n<b>Имя пользователя</b>\n${name}\n\n<b>TelegramId</b>\n${telegramId}\n\n<b>Почта</b>\n${email}\n\n<b>Имя пользователя на корпортаивном сайте</b>\n${loginCorp}\n\n<b>Дата регистрации</b>\n${new Date().toLocaleDateString('ru-RU')}`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Подтвердить', callback_data: `${newUser.id}|CONFIRMED|user_agreed` },
              { text: 'Отклонить', callback_data: `${newUser.id}|CONFIRMED|user_disagreed` }
            ]
          ]
        }
      }
    )

    return NextResponse.json({
        success: true,
        message: 'Пользователь успешно зарегестрирован! Уведомление о получения разрешения на вход в систему придет в телеграм боте',
        data: 'done'
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