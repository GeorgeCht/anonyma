import chalk from 'chalk'
import crypto from 'crypto'

import * as permanentChannels from './src/lib/permanent_channels.json'

function encrypt(text) {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.CIPHER_KEY, 'hex'),
    Buffer.from(process.env.VECTOR_KEY, 'hex'),
  )
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
  return encrypted.toString('hex')
}

function logGreenOutput(descr, value) {
  console.log(chalk.greenBright(`${descr}:`))
  console.log(chalk.greenBright('█'.repeat(value.length)))
  console.log(chalk.bgGreenBright.black(value))
  console.log(chalk.greenBright('█'.repeat(value.length)))
  console.log('\n')
  return
}

function getTagsFromPermaChannels() {
  return [
    ...new Set(
      permanentChannels.reduce((acc, channel) => acc.concat(channel.tags), []),
    ),
  ]
}

// Check if arguments are provided
const args = process.argv.slice(2)

if (args.length === 0) {
  console.log(
    chalk.greenBright('Please provide an argument.\nUse'),
    chalk.bgGreenBright.black('npm run config generate'),
    chalk.greenBright('for new secret env variables.\nOr'),
    chalk.bgGreenBright.black('npm run config get-key'),
    chalk.greenBright('for accessing the admin config key.'),
  )
  process.exit(1)
}

chalk.greenBright('Please provide an argument.\nUse '),
  chalk.bgGreenBright.black('npm run config generate'),
  chalk.greenBright(' for new secret env variables.\nOr '),
  chalk.bgGreenBright.black('npm run config get-key'),
  chalk.greenBright(' for accessing the admin config key.')

switch (args[0]) {
  case 'get-key':
    const secret = process.env.SECRET
    const configKey = encrypt(secret)

    if (!secret) {
      console.error('Secret environment variable missing.')
      process.exit(1)
    }

    if (!configKey) {
      console.error('Config key encryption failed.')
      process.exit(1)
    }

    logGreenOutput('Config Key', configKey)

    break
  case 'generate':
    const generateSecret = () => crypto.randomBytes(32).toString('base64')
    const generateVector = () => crypto.randomBytes(16).toString('hex')
    const generateCypher = () => crypto.randomBytes(32).toString('hex')

    logGreenOutput('Secret', generateSecret())
    logGreenOutput('Cypher', generateCypher())
    logGreenOutput('Vector', generateVector())

    break
  default:
    console.log('Please provide an argument.')
    process.exit(1)
}
