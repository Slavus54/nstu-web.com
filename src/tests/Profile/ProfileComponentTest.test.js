const {onGenerateSessionDate, onGetShorterTitle, onGetCoordinatesDistance, projectTitle} = require('../test-api')

describe('Account and Profile Components Tests', () => {
    test('Generate and validate session date of profile', () => {
        let date = onGenerateSessionDate()

        expect(date).not.toBe(null)
    })

    test('Check short title of project', () => {
        let title = onGetShorterTitle()

        expect(title).not.toBe('')
        expect(title.length).toBeLessThan(projectTitle.length)
    })

    test('Find and check distance between coordinates', () => {
        let result = onGetCoordinatesDistance()

        expect(result).not.toBe(null)
        expect(result).toBeLessThan(1e1)
    })
})