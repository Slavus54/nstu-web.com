import React, {useState, useContext, useLayoutEffect} from 'react'
import {datus} from '../../shared/libs/libs'
import {AppContext} from '../../context/AppContext'
import {getProfileInfo, updateProfileInfo, createSession, onGetProfileFromServer} from '../../utils/storage'
import {changeTitle} from '../../utils/notifications'
import AccountSidebar from '../pages/Account/AccountSidebar'
import Exit from '../../shared/UI/Exit'
import {ContextType} from '../../env/types'

const Account: React.FC = () => {
    const {account} = useContext<ContextType>(AppContext)
    const [profile, setProfile] = useState(null)

    useLayoutEffect(() => {
        changeTitle('Аккаунт')

        let data = getProfileInfo()

        if (data !== null) {
            createSession({name: data.name, dateUp: datus.now('dateUp')})
            setProfile(data)

        } else {
            onGetProfileFromServer(account.name).then((result: any) => {
                updateProfileInfo(result)
                setProfile(result)
            })
        }
    }, [])
    
    return (
        <>
            <AccountSidebar profile={profile} />
            <Exit />
        </>
    )
}

export default Account