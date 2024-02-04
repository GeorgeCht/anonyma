import React from 'react'
import useSettings from '@/stores/settings'
import clsx from 'clsx'
import { useDoubleTap } from 'use-double-tap'

const MessageAnnouncement = ({
  announcement,
  sticky,
}: {
  announcement: string
  sticky: boolean
}) => {
  const { displayChannelTags, pinAnnouncement, setPinAnnouncement } =
    useSettings()
  const bindDoubleTap = useDoubleTap(() => {
    setPinAnnouncement(!pinAnnouncement)
  })
  const ulClass = displayChannelTags
    ? 'top-[134px] sm:top-[165px]'
    : 'top-[122px] sm:top-[140px]'
  const AnnounementBubble = () => {
    return (
      <React.Fragment>
        <li className={'flex relative w-full'}>
          <p
            className={
              'text--body-sm mt-5 mb-2 text-light/30 cursor-default transiticon-colors'
            }
          >
            #Announcement
          </p>
        </li>
        <li className={'flex relative w-full'} {...bindDoubleTap}>
          <div
            role={'announcement'}
            className={
              'flex-row group flex relative w-full items-center justify-between gap-1 sm:gap-4'
            }
          >
            <div
              className={
                'flex flex-row flex-none items-center gap-3 max-w-[100%]'
              }
            >
              <div
                role={'message-announcement'}
                data-sender={'anon'}
                className={
                  'bg-gradient-to-tl from-accent-primary to-accent-secondary text-dark flex flex-none px-5 py-5 mb-0 rounded-2xl transition-all max-w-[100%]'
                }
              >
                <p className={'text--mono-base cursor-default'}>
                  {announcement}
                </p>
              </div>
            </div>
          </div>
        </li>
      </React.Fragment>
    )
  }
  return (
    <React.Fragment>
      {sticky ? (
        <ul
          className={clsx(
            ulClass,
            'flex flex-col w-full sticky z-[29] transition-all bg-dark pb-2 after:inline-flex',
            'after:-bottom-3 after:absolute after:-mb-3 after:bg-gradient-to-b after:from-dark',
            'after:content-empty after:w-full after:h-6',
          )}
        >
          <AnnounementBubble />
        </ul>
      ) : (
        <AnnounementBubble />
      )}
    </React.Fragment>
  )
}

export default MessageAnnouncement
