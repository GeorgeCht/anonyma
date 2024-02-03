'use client'
import { useReducer, Dispatch } from 'react'

export type HeaderState = {
  logo: boolean
  logoTheme: 'dark' | 'light'
  middle: 'inner-page' | 'search' | 'empty'
  rightside: boolean
}

export type HeaderAction =
  | { type: 'SET_LOGO'; payload: boolean }
  | { type: 'SET_LOGO_THEME'; payload: 'dark' | 'light' }
  | { type: 'SET_MIDDLE_STATE'; payload: 'inner-page' | 'search' | 'empty' }
  | { type: 'SET_RIGHTSIDE'; payload: boolean }

export const initialState: HeaderState = {
  logo: false,
  logoTheme: 'dark',
  middle: 'empty',
  rightside: false,
}

export const headerReducer = (
  state: HeaderState,
  action: HeaderAction
): HeaderState => {
  switch (action.type) {
    case 'SET_LOGO':
      return { ...state, logo: action.payload }
    case 'SET_LOGO_THEME':
      return { ...state, logoTheme: action.payload }
    case 'SET_MIDDLE_STATE':
      return { ...state, middle: action.payload }
    case 'SET_RIGHTSIDE':
      return { ...state, rightside: action.payload }
    default:
      return state
  }
}

export const useHeaderReducer = (): [HeaderState, Dispatch<HeaderAction>] => {
  const [headerState, headerDispatch] = useReducer(headerReducer, initialState)
  return [headerState, headerDispatch]
}
