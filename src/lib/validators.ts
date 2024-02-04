import { z } from 'zod'
import expletives from './expletives.json'

export const newChannelSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters.' })
      .max(24, { message: 'Name cannot exceed 24 characters.' })
      .regex(/^[a-zA-Z0-9_-]+(?:,[a-zA-Z0-9_-]+)*$/, {
        message:
          'Invalid channel name. Only only letters, numbers, underscores, and hyphens allowed.',
      }),
    tags: z
      .string()
      .superRefine((tags, ctx) => {
        if (tags.length > 0) {
          const tagsArray = tags.split(',')
          if (tagsArray.every((tag) => tag.length <= 2)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Tags must be at least 2 characters.',
            })
          }
          if (tagsArray.every((tag) => tag.length >= 24)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Tags cannot exceed 24 characters.',
            })
          }
          if (tagsArray.every((tag) => tag.toLowerCase() === 'public')) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Tag 'public' cannot be used.",
            })
          }
        }
      })
      .nullable(),
    access: z.enum(['private', 'public']).nullable(),
    password: z
      .string()
      .min(4, { message: 'Password must be at least 4 characters.' })
      .max(32, { message: 'Password cannot exceed 32 characters.' })
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.access === null || data.access === 'public') {
        return data.password === null || data.password === ''
      }
      return true
    },
    {
      message: 'Password should be empty.',
    },
  )

export type NewChannelSchemaType = z.infer<typeof newChannelSchema>

export const editAnnouncementSchema = z.object({
  announcement: z
    .string()
    .min(6, { message: 'Announcement must be at least 6 characters.' })
    .max(264, { message: 'Announcement cannot exceed 264 characters.' })
    .regex(
      /^[a-zA-Z0-9_,.\s!@#$%^&*()_\-+=/?\\[\]]+(?:,[a-zA-Z0-9_,.\s!@#$%^&*()_\-+=/?\\[\]]+)*$/,
      {
        message: 'Invalid announcement name.',
      },
    )
    .superRefine((announcement, ctx) => {
      const string = announcement.toLowerCase()
      if (expletives.some((word) => string.includes(word.toLowerCase()))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Announcement contains profanity.',
        })
      }
    }),
  name: z.string(),
})

export type EditAnnouncementSchemaType = z.infer<typeof editAnnouncementSchema>

export const sendMessageSchema = z.object({
  message: z
    .string({
      required_error: 'Message cannot be empty.',
    })
    .min(1, { message: 'Message cannot be empty.' })
    .max(264, { message: 'Message cannot exceed 264 characters.' })
    .regex(/^[a-zA-Z0-9\s.,!?(){}[\]<>@#$%^&*-_+=:;'"`|\\/]*$/, {
      message: 'Forbidden character in use.',
    }),
  id: z.string(),
})

export type SendMessageSchemaType = z.infer<typeof sendMessageSchema>

export const messageSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  senderUsername: z.string(),
  message: z.string(),
  timestamp: z.number(),
  channelId: z.string(),
})

export type MessageSchemaType = z.infer<typeof messageSchema>
