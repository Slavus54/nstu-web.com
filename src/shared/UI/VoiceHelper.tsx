import {useState} from 'react'
import {useAtom} from 'jotai'
import {recognition, onVoiceResultHandler} from '../../utils/voice'
import {isVoiceAtom} from '../../store/atoms'
import ImageLook from './ImageLook'
import VoiceImage from '../../assets/voice.png'

const VoiceHelper = () => {
    const [isVoice, setIsVoice] = useAtom(isVoiceAtom)

    const onStateHandler = () => {
        let flag: boolean = !isVoice

        if (flag) {
            recognition.start()
        } else {
            recognition.abort()
        }   

        setIsVoice(flag)
    }

    recognition.onresult = e => {
        let text: string = onVoiceResultHandler(e)

        if (text === 'вперёд') {
            window.history.forward()
        } else if (text === 'назад') {
            window.history.back()
        }
    }

    return <ImageLook onClick={onStateHandler} src={VoiceImage} className='icon' />
}

export default VoiceHelper