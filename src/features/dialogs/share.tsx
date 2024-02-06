import React from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog'
import {
  DialogBody,
  DialogClarification,
  DialogSeperator,
} from '@/features/dialogs/dialog-items'
import { QRCodeSVG } from 'qrcode.react'
import { LinkIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/elements'
import IconViber from '@/components/ui/icons/icon-viber'
import IconTelegram from '@/components/ui/icons/icon-telegram'
import IconWhatsApp from '@/components/ui/icons/icon-whatsapp'
import { toast } from 'sonner'

const Share = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const channelName = pathname.split('/c/')[1]
  const constructedUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/inv/${channelName}`
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={'sm:max-w-[386px]'}>
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className={'flex justify-center w-100 pt-5'}>
            <div className={'rounded-lg border border-light/10 p-5'}>
              <QRCodeSVG
                value={constructedUrl}
                size={246}
                bgColor={'rgb(var(--color-dark) / 0)'}
                fgColor={'rgb(var(--color-light) / 1)'}
              />
            </div>
          </div>

          {/* Seperator */}
          <DialogSeperator />

          <div className={'flex flex-col gap-1.5'}>
            {/* Share on Viber Button */}
            <Button
              intent={'full'}
              size={'lg'}
              className={'bg-[#7360F2] hover:bg-[#7360F2] text-light'}
              onClick={() =>
                window.open(`viber://forward?text=${constructedUrl}`, '_blank')
              }
            >
              <IconViber />
              Share on Viber
            </Button>

            {/* Share on Telegram Button */}
            <Button
              intent={'full'}
              size={'lg'}
              className={'bg-[#2BA7DD] hover:bg-[#2BA7DD] text-light'}
              onClick={() =>
                window.open(`tg://msg?text=${constructedUrl}`, '_blank')
              }
            >
              <IconTelegram />
              Share on Telegram
            </Button>

            {/* Share on WhatsApp Button */}
            <Button
              intent={'full'}
              size={'lg'}
              className={'bg-[#25D366] hover:bg-[#25D366] text-light'}
              onClick={() =>
                window.open(`https://wa.me/?text=${constructedUrl}`, '_blank')
              }
            >
              <IconWhatsApp />
              Share on WhatsApp
            </Button>
          </div>
        </DialogBody>
        <DialogFooter className={'sm:justify-start'}>
          <DialogClarification className={'pb-3 pt-1'}>
            Settings are stored and applied locally only for your device. You
            can also reset settings to default.
          </DialogClarification>
          <Button
            intent={'full'}
            size={'lg'}
            onClick={() => {
              navigator.clipboard.writeText(constructedUrl)
              toast.success('Link copied to clipboard.')
            }}
          >
            <LinkIcon className={'mr-2'} size={15} strokeWidth={2.75} />
            Copy link
          </Button>
          <DialogClose asChild>
            <Button
              intent={'full'}
              variant={'ghost'}
              size={'lg'}
              className={'px-8'}
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Share
