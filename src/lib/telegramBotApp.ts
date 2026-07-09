import TelegramBot from 'node-telegram-bot-api'
import {prisma} from '@/lib/prisma'


declare global {
  var botApp: TelegramBot
  var botListenersReady: boolean | undefined
}


export async function telegramBotApp (token: string) {



  if (!token) {
    throw new Error(`Не передан telegram bot`)
  }

  if (!globalThis.botApp) {
    console.log('Бот не создан, создаем')
    globalThis.botApp = new TelegramBot(token, {polling: true})
  }

  const info = await globalThis.botApp.getMe()

  console.log(`Подключен бот ${info.username}`)
  return globalThis.botApp
  


}