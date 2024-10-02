export const recognition = new webkitSpeechRecognition()

recognition.interimResults = false
recognition.lang = 'ru-RU'

export const onVoiceResultHandler = (e) => {
    let result = e.results[0][0].transcript
    
    if (result !== '') {
        result = result.toLowerCase()
    } else {
        recognition.abort()
    }

    return result
}