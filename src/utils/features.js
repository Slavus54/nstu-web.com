import {codus, datus} from "../shared/libs/libs"

export const onDownloadFile = (file = null, name = '', format = 'jpg') => {
    if (file) {
        let a = document.createElement('a')

        a.setAttribute('href', file)
        a.setAttribute('download', codus.short(name) + '_' + datus.now('date') + '.' + format)
        
        a.click()
    }
}

export const onEstimatePasswordDifficulty = text => {
    let result = 0

    if (typeof text === 'string') {
        text = text.split('')

        const length = text.length
        let middle = length / 2

        result = length 

        for (let i = 0; i < middle; i++) {
            let current = text[i]
            let next = text[i + 1]
            let points = 0

            if (next) {
                if (current !== next) {
                    points++
                }
    
                if (current.toUpperCase() !== current && next.toUpperCase() === next) {
                    points++
                }

                if (next.toUpperCase() !== next && current.toUpperCase() === current) {
                    points++
                }
            }         

            result += points
        }
    }

    return result
}

export const onHandleKeyboardTrigger = (func, key = 'Enter', event = 'keydown') => window.addEventListener(event, e => {
    e.stopImmediatePropagation()
    
    if (e.key === key) {
        func()
    } 
}, true)