import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { v4 as uniqueID } from 'uuid'
import adjectives from './adjectives.json'
import expletives from './expletives.json'
import nouns from './nouns.json'
import crypto from 'crypto'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function joinTagsAndTrim(
  tags: string[],
  maxLength: number,
): { trimmedTags: string[]; remainingTags: string[] | null } {
  const joinedTags = tags.join(', ') // Join the tags with a comma and a space
  const trimmedTags =
    joinedTags.length <= maxLength
      ? joinedTags
      : joinedTags.slice(0, maxLength) + '...' // Trim the string to the specified length

  let finalTags = trimmedTags.split(', ') // Split the string back to an array
  let remainingTags: string[] | null = null

  if (finalTags[finalTags.length - 1].endsWith('...')) {
    remainingTags = tags.slice(finalTags.length - 1)
    finalTags.pop() // Removes the last tag if it ends with '...'
  }

  return { trimmedTags: finalTags, remainingTags: remainingTags }
}

export function generateUsername(
  adj: Array<string>,
  noun: Array<string>,
): string {
  let random = (array: string[]): string =>
    array[Math.floor(Math.random() * array.length)]
  let a = random(adj)
  let n = random(noun)
  return `${a.charAt(0).toUpperCase()}${a.slice(1)}${n
    .charAt(0)
    .toUpperCase()}${n.slice(1)}`
}

export function uniqueUsername() {
  return generateUsername(adjectives, nouns)
}

export function uniqueBase64() {
  return btoa(uniqueID().replace(/-/g, '').substring(0, 24))
}

export function uniqueId() {
  return `A${uniqueBase64().substring(1)}`
}

export function getLocalizedUrl(host: string | null) {
  const protocal = process?.env.NODE_ENV === 'development' ? 'http' : 'https'
  return `${protocal}://${host}`
}

export function toPusherKey(key: string) {
  return key.replace(/:/g, '__')
}

export function debounce(callback: Function, wait: number, immediate = false) {
  let timeout: string | number | NodeJS.Timeout | undefined

  return function (this: any, ...args: any[]) {
    const callNow = immediate && !timeout
    const nextDo = () => callback.apply(this, args)

    clearTimeout(timeout)
    timeout = setTimeout(nextDo, wait)

    if (callNow) {
      nextDo()
    }
  }
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function timeAgo(timestamp: number): string {
  const now = Date.now()
  const secondsAgo = Math.floor((now - timestamp) / 1000)

  if (secondsAgo < 10) {
    return 'just now'
  } else if (secondsAgo < 60) {
    return `${secondsAgo} secs ago`
  } else if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60)
    return `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`
  } else {
    const hours = Math.floor(secondsAgo / 3600)
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  }
}

export interface Hash {
  vector: string
  encryptedData: string
}

export function encrypt<T extends boolean>(
  text: string,
  options: { withServerVector: T },
) {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.CIPHER_KEY, 'hex'),
    options.withServerVector
      ? Buffer.from(process.env.VECTOR_KEY, 'hex')
      : crypto.randomBytes(16),
  )

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

  return (
    options.withServerVector
      ? encrypted.toString('hex')
      : {
          vector: (options.withServerVector
            ? Buffer.from(process.env.VECTOR_KEY, 'hex')
            : crypto.randomBytes(16)
          ).toString('hex'),
          encryptedData: encrypted.toString('hex'),
        }
  ) as T extends true ? string : Hash
}

export function decrypt<T extends boolean>(
  input: T extends true ? string : Hash,
  options: { withServerVector: T },
): string {
  let encryptedText = Buffer.from(
    options.withServerVector
      ? (input as string)
      : (input as Hash).encryptedData,
    'hex',
  )
  let vector = options.withServerVector
    ? Buffer.from(process.env.VECTOR_KEY, 'hex')
    : Buffer.from((input as Hash).vector, 'hex')
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.CIPHER_KEY, 'hex'),
    vector,
  )
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

// Decrypting text
export function decrypt2(input: Hash) {
  let vector = Buffer.from(input.vector, 'hex')
  let encryptedText = Buffer.from(input.encryptedData, 'hex')
  let decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(Buffer.from(process.env.CIPHER_KEY, 'hex')),
    vector,
  )
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

export function sanitateTags(tags: Array<string>): Array<string> {
  return Array.from(
    new Set<string>(tags.map((tag) => tag.trim().replace(/[^a-zA-Z0-9]/g, ''))),
  ).filter(Boolean)
}

export function detectURLs(text: string) {
  var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g
  return text.match(urlRegex)
}

export function extractDomainAndExt(
  url: string,
): { domain: string; ext: string } | null {
  const regex = /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+)\.([a-zA-Z]{2,})$/
  const match = url.match(regex)
  return match ? { domain: match[1], ext: match[2] } : null
}

export function getFromAndTo(page: number, itemPerPage: number) {
  let from = page * itemPerPage
  let to = +from + +itemPerPage

  if (page > 0) {
    from += 1
  }
  return { from, to }
}

export function filterUnsentMessages(messages: Array<Message>): Array<Message> {
  const duplicateIds = messages
    .filter((message) => message.message === '')
    .map((message) => message.id)

  return messages.filter((message) =>
    duplicateIds.includes(message.id) ? message.message === '' : true,
  )
}

export function sortMessagesByTimestamp(
  messages: Array<Message>,
): Array<Message> {
  return messages.sort((a, b) => a.timestamp - b.timestamp)
}

export function timestampToHours(timestamp: number): string {
  const hours = Math.floor(timestamp / (60 * 60))
  return hours.toString().padStart(2, '0') + ' hours'
}

export function censorExpletives(input: string): string {
  const expletiveList: Array<string> = expletives

  return input
    .split(' ')
    .map((word) => {
      // Check if the word is an expletive
      if (expletiveList.includes(word.toLowerCase())) {
        // Replace expletive word with asterisks of the same length
        return '*'.repeat(word.length)
      } else {
        return word
      }
    })
    .join(' ')
}
