import {TOWNS_API_ENDPOINT, MIN_RUSSIAN_TOWN_INDEX, MAX_RUSSIAN_TOWN_INDEX, TOWNS_API_KEY, SESSION_INFO_KEY, ACCOUNT_INFO_KEY, PROFILE_URL} from '../env/env'

export const checkStorageData = (key, isLocal = true) => eval(isLocal ? 'localStorage' : 'sessionStorage').getItem(key) === null

// Towns API

export const getTownsFromServer = async () => {
    let data = await fetch(TOWNS_API_ENDPOINT)
    let result = await data.json()

    result = result.slice(MIN_RUSSIAN_TOWN_INDEX, MAX_RUSSIAN_TOWN_INDEX)

    localStorage.setItem(TOWNS_API_KEY, JSON.stringify(result || []))
}

export const getTownsFromStorage = () => {
    return checkStorageData(TOWNS_API_KEY) ? [] : JSON.parse(localStorage.getItem(TOWNS_API_KEY))
}

// Current Session 

export const createSession = ({name, dateUp}) => {
    let sessions = checkStorageData(SESSION_INFO_KEY, false) ? [] : JSON.parse(sessionStorage.getItem(SESSION_INFO_KEY))
    let flag = sessions.find(el => el.name === name) === undefined

    if (flag) {
        sessionStorage.setItem(SESSION_INFO_KEY, JSON.stringify([{name, dateUp}, ...sessions]))
    }
}

export const getSessions = () => {
    return checkStorageData(SESSION_INFO_KEY, false) ? [] : JSON.parse(sessionStorage.getItem(SESSION_INFO_KEY))
}

// Profile

export const updateProfileInfo = (profile) => {
    localStorage.setItem(ACCOUNT_INFO_KEY, JSON.stringify(profile))
    window.location.reload()
}

export const getProfileInfo = () => {
    return checkStorageData(ACCOUNT_INFO_KEY) ? null : JSON.parse(localStorage.getItem(ACCOUNT_INFO_KEY))
}

export const onGetProfileFromServer = async (name = '') => {
    let data = await fetch(PROFILE_URL, {
        method: 'POST',
        body: JSON.stringify({name}),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    data = await data.json()

    return data
}