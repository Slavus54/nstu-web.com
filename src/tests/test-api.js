const {Codus} = require('codus.js')
const {Datus} = require('datus.js')

const codus = new Codus()
const datus = new Datus()

const projectTitle = 'Робот-строитель на C++ для промышленного использования'

const dotA = {
    lat: 54.9873,
    long: 82.9051
}

const dotB = {
    lat: 54.9875,
    long: 82.8547
}

const onGenerateSessionDate = () => datus.now('date')
const onGetShorterTitle = () => codus.short(projectTitle)
const onGetCoordinatesDistance = () => codus.haversine(dotA.lat, dotA.long, dotB.lat, dotB.long)

module.exports = {onGenerateSessionDate, onGetShorterTitle, onGetCoordinatesDistance, projectTitle}