'use client'

import React from 'react'
import * as Dialog from '@/features/dialogs'

const ChannelDialogs = () => {
  return (
    <React.Fragment>
      <Dialog.NewChannel>
        <button
          id={'trigger--new-channel-dialog'}
          className={'hidden'}
          aria-hidden
        />
      </Dialog.NewChannel>
      <Dialog.ChannelPassword>
        <button
          id={'trigger--channel-password-dialog'}
          className={'hidden'}
          aria-hidden
        />
      </Dialog.ChannelPassword>
      <Dialog.EditChannel>
        <button
          id={'trigger--edit-channel-dialog'}
          className={'hidden'}
          aria-hidden
        />
      </Dialog.EditChannel>
      <Dialog.EditAnnouncement>
        <button
          id={'trigger--edit-announcement-dialog'}
          className={'hidden'}
          aria-hidden
        />
      </Dialog.EditAnnouncement>
      <Dialog.Settings>
        <button
          id={'trigger--settings-dialog'}
          className={'hidden'}
          aria-hidden
        />
      </Dialog.Settings>
      <Dialog.Share>
        <button id={'trigger--share-dialog'} className={'hidden'} aria-hidden />
      </Dialog.Share>
      <Dialog.RemoveMessage>
        <button
          id={'trigger--remove-message-dialog'}
          className={'hidden'}
          aria-hidden
        />
      </Dialog.RemoveMessage>
    </React.Fragment>
  )
}

export default ChannelDialogs
