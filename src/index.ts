import 'dotenv/config'

const username = process.env.USERNAME!
const checkInterval = parseInt(process.env.CHECK_INTERVAL!)
const bearerToken = process.env.TWITTER_BEARER_TOKEN!
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL!

async function check() {
  console.log('checking...')
  const res = await fetch(
    `https://api.twitter.com/2/users/by/username/${username}`,
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    }
  )
  const json = await res.json()

  if (json['errors']) {
    const body = {
      content: [
        '@everyone',
        `${username} が使えるようになりました。`,
        `https://twitter.com/${username}`,
      ].join('\n'),
    }

    await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  } else {
    setTimeout(check, checkInterval)
  }
}

async function main() {
  await check()
}

main()
