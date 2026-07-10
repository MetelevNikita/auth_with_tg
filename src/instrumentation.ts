




export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('Server started in Node.js runtime')


    const adminBot = async () => {

      const TOKEN = process.env.TOKEN as string
      const { telegramBot } = await import('./lib/telegramBot')
      await telegramBot(TOKEN) as any
      
      const infoBot = await globalThis.bot.getMe()
      console.log(`work bot: ${infoBot.username}`)

    }

    await adminBot()

  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    console.log('Running in Edge runtime')
  }
}