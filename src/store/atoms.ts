import {atom} from 'jotai'

export const placeTitleAtom = atom<string>('')
export const placeCategoryAtom = atom<string>('')
export const distanceAtom = atom<number>(0)

export const isVoiceAtom = atom<boolean>(false)

export const imageContentAtom = atom<string>('')