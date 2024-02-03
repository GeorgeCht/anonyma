// NOTE: This file should not be edited

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_DOMAIN: string

    UPSTASH_REDIS_REST_URL: string
    UPSTASH_REDIS_REST_TOKEN: string

    SECRET: string
    CONFIG_KEY: string
    CIPHER_KEY: string
    VECTOR_KEY: string

    PUSHER_APP_ID: string
    PUSHER_SECRET: string
    NEXT_PUBLIC_PUSHER_KEY: string
    NEXT_PUBLIC_PUSHER_CLUSTER: string

    EXPIRATION: string
    MAX_CHANNELS: number

    DEFAULT_CHANNEL_ANNOUNCEMENT: string
    NEXT_PUBLIC_LIMIT_MESSAGES: number
  }
}
