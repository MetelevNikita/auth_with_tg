import TelegramBot from 'node-telegram-bot-api'
import {prisma} from '@/lib/prisma'



declare global {
  var bot: TelegramBot
  var botAuthListenersReady: boolean | undefined
}


  async function confimedUser (id: string, query: any, answer: string, chatId: number) {

    try {
      
      const currentUser = await prisma.user.findFirst({
        where: {
          id: parseInt(id)
        }
      })

      if (!currentUser) {
        console.error('Не найден пользователь в базе данных')
        return 'Не найден пользователь в базе данных'
      }

      const updateUser = await prisma.user.update({
        where: {
          id: parseInt(id)
        },
        data: {
          сonfirmed: true
        }
      })

      if (updateUser) {

        globalThis.bot.sendMessage(currentUser.telegramId as string, `Пользователь id:${currentUser.id}#${currentUser.name} добавлен в систему\n\nВход разрешен\n\nПерезагрузите страницу входа`, {parse_mode: 'HTML'})

        globalThis.bot.editMessageText({
          parse_mode: 'HTML',
          chat_id: query.message?.chat.id,
          message_id: query.message?.message_id,
          text: `Пользователь id: ${currentUser.id}#${currentUser.name as string} авторизован и добавлен в базу данных\n\nДата обработки\n${new Date().toLocaleDateString('RU-ru')} - ${new Date().toLocaleTimeString('RU-ru')}`
        })

        return 'Сообщение отправлено'

      } else {
        console.error('Ошибка отпраки')
      }

    } catch (error) {
      console.error(error)
      return `Ошбика смены статуса регистрации пользваотеля`
    }
  }

  async function deleteUser (id: string, query: any, answer: string, chatId: number) {


    try {
      
        const checkUser = await prisma.user.findFirst({
          where: {
            id: parseInt(id)
          }
        })

        if (!checkUser) {
          console.log(`Ошибка удаления пользователя`)
          globalThis.bot.sendMessage(chatId, 'Ошибка удаления пользователя')
          return `Ошбика удаления пользваотеля`
        }


        const deleteUser = await prisma.user.delete({
          where: {
            id: parseInt(id)
          }
        })

        console.log('Пользователь удален')

        globalThis.bot.sendMessage(checkUser.telegramId, `Администрация сайта pr-tz.ru удалили пользователя ${checkUser.name}\n\nЗа дополнительной информацией обратитесь в службу PR\n\nДата удаления ${new Date().toLocaleDateString('RU-ru')}`, {parse_mode: 'HTML'})


        globalThis.bot.editMessageText({
          chat_id: query.message?.chat.id,
          message_id: query.message?.message_id,
          text: `Пользователь ${id}#${answer} - Удален\nДата удаления - ${new Date().toLocaleDateString('RU-ru')}`
        })

        return 'Сообщение удалено'

    } catch (error) {
      console.error(error)
      return `Ошбика удаления пользваотеля`
    }



  }

  async function resetUser (id: string, query: any, answer: string, chatId: number) {

    try {
      
      const checkUser = await prisma.user.findFirst({
        where: {
          id: parseInt(id)
        }
      })

      if (!checkUser) {
        console.log(`Ошибка смены статуса пользователя`)
        globalThis.bot.sendMessage(chatId, 'Ошибка удаления пользователя')
        return
      }

      const changeStatus = await prisma.user.update({
        where: {
          id: parseInt(id)
        },
        data: {
          сonfirmed: false
        }
      })

      if (!changeStatus) {

        console.error('Ошибка смены статуса')
        globalThis.bot.sendMessage(query.message?.chat.id as number | string, `Ошибка смены статуса пользователя ${id}#${answer}, попробуйте позже`)
        return 'Сообщение изменено'
      }


      globalThis.bot.sendMessage(checkUser.telegramId, `Администрация сайта pr-tz.ru изменили стату регистрации пользователя ${checkUser.name}\n\nДоступ на сайт запрещен\n\nЗа дополнительной информацией обратитесь в службу PR\n\nДата удаления ${new Date().toLocaleDateString('RU-ru')}`)

      globalThis.bot.editMessageText({
        chat_id: query.message?.chat.id,
        message_id: query.message?.message_id,
        text: `Пользователь ${id}#${answer} - Изменен\n\nСтатус активации пользователя в системе - Ожидает подтверждения\nДата удаления - ${new Date().toLocaleDateString('RU-ru')}`
      })


        return 'Сообщение изменено'


    } catch (error) {
      console.error(error)
      return 'Ошибка из изменения'
    }

  }


export async function telegramBot (token: string) {

  if (!token) {
    throw new Error(`TOKEN is empty`)
  }

  if (!globalThis.bot) {
    console.log('create new bot')
    globalThis.bot = new TelegramBot(token, {polling: true})
  }


  // message

    bot.on('message', async (msg) => {

        const text = msg.text
        const id = msg.chat.id
    
        if (id.toString() !== process.env.ADMIN_GROUP as number | string) {
          console.log('Не админская группа')
          return
        }
    
        const resCommand = await globalThis.bot.setMyCommands([
          { command: 'start', description: 'Start bot' },
          { command: 'help', description: 'Help' },
        ])
    
        console.log(resCommand)
    
        if (text === '/start') {
          bot.sendMessage(id, 'Админ бот приложения PR-TZ.ru', {
            reply_markup: {
              keyboard: [
                [{ text: 'Получить список пользователей' }],
                [{ text: 'Удалить пользователя' }],
              ],
              resize_keyboard: true,
              one_time_keyboard: true
            }
          })
        }
    
        if (text === 'Получить список пользователей') {
      
          const allUsers = await prisma.user.findMany()
    
          if (allUsers.length < 1) {
            globalThis.bot.sendMessage(id, 'Список пуст', {parse_mode: 'HTML'})
            return 'Данные получены'
          } else {
              allUsers.map((item: {id: number, name: string, email: string, сonfirmed: boolean, createAt: Date, }) => {
              
              const message = `${item.id}#${item.name} - ${item.email} # Подтверждение ${(item.сonfirmed) ? 'Подтвержден' : 'Ожидает подтверждения'} - Дата создания ${new Date(item.createAt).toLocaleDateString('RU-ru')}`
    
              globalThis.bot.sendMessage(id, message, {
                reply_markup: {
                  inline_keyboard: [
                    [{text: 'Удалить', callback_data: `${item.id}|DELETE|${item.name}`}],
                    [{text: 'Сенить пароль', callback_data: `${item.id}|RESET|${item.name}`}]
                  ]
                }
              })
              return 'Данные получены'
            })
          }
    
    
        }


    })


    bot.on('callback_query', async (query) => {

        if (!query.message || !('text' in query.message) || !('chat' in query.message)) {
          return 'Сообщение не найдено'
        }

        const chatId = query.message?.chat.id
        const data = query.data?.split('|') as any
        const text = query.message.text



        const answer = data[2]
        const method = data[1]
        const id = data[0]

        console.log(answer)

        if (!text) {
          return 'Сообщение не найдено'
        }

        // 

        if (answer === 'user_agreed') {

          switch (method) {
            case 'CONFIRMED':
              return await confimedUser(id, query, answer, chatId)
            case 'DELETE':
              return await deleteUser(id, query, answer, chatId)
            case 'RESET':
              return await resetUser(id, query, answer, chatId)
              
          }

          return

        }

        if (answer === 'user_disagreed') {
          await deleteUser(id, query, answer, chatId)
          return
        }
    })

    // error

    bot.on('polling_error', (error) => {
      console.error(`Ошибка Пулинга бота ${error.message}`)
      return `Ошибка Пулинга бота ${error.message}`
    })

    bot.on('error', (error) => {
      console.error(`Ошибка бота ${error.message}`)
      return `Ошибка бота ${error.message}`
    })



    // 


  

  return globalThis


}