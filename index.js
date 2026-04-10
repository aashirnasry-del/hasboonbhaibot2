const mineflayer = require('mineflayer')

const HOST = 'PVPpracticeO.aternos.me'
const PORT = 60322

const USERNAME = 'HasboonBotYT_99'
const PASSWORD = 'hasboon99'

let bot
let loggedIn = false
let reconnecting = false

function createBot () {
  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME
  })

  console.log('🔄 Starting bot...')

  bot.on('spawn', () => {
    console.log('✅ Bot spawned')
    loggedIn = false

    // wait before login (important for SimpleLogin plugin)
    setTimeout(() => {
      bot.chat(`/login ${PASSWORD}`)
      console.log('🔐 Login sent')
    }, 6000)

    // chat every 20 minutes
    setInterval(() => {
      if (loggedIn && bot.entity) {
        bot.chat('subscribe to hasboonbhai')
      }
    }, 20 * 60 * 1000)

    // light movement (anti-AFK)
    setInterval(() => {
      if (!loggedIn || !bot.entity) return

      const yaw = Math.random() * Math.PI * 2
      bot.look(yaw, 0)

      bot.setControlState('forward', true)
      setTimeout(() => {
        bot.setControlState('forward', false)
      }, 1500)

    }, 30000)
  })

  // detect login messages
  bot.on('messagestr', (msg) => {
    const text = msg.toLowerCase()

    if (text.includes('logged in') || text.includes('successfully')) {
      loggedIn = true
      console.log('✅ Login confirmed')
    }

    if (text.includes('wrong') || text.includes('incorrect')) {
      console.log('❌ Login failed (check password)')
    }
  })

  bot.on('kicked', (reason) => {
    console.log('❌ Kicked:', reason)
  })

  bot.on('error', (err) => {
    console.log('⚠️ Error:', err.message)
  })

  bot.on('end', () => {
    if (reconnecting) return
    reconnecting = true

    console.log('🔄 Disconnected. Reconnecting in 10s...')

    setTimeout(() => {
      reconnecting = false
      createBot()
    }, 10000)
  })
}

createBot()
