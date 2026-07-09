




export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('Server started in Node.js runtime')


    const adminBot = async () => {

      const TOKEN = process.env.TOKEN_AUTH as string
      const { telegramBotAuth } = await import('./lib/telegramBotAdmin')
      await telegramBotAuth(TOKEN)

    }


    const appBot = async () => {
            const TOKEN = process.env.TOKEN_APP as string
      const { telegramBotApp } = await import('./lib/telegramBotApp')
      await telegramBotApp(TOKEN)
    }


    await adminBot()
    await appBot()







  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    console.log('Running in Edge runtime')
  }
}