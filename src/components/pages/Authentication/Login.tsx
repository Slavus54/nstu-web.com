import React, {useState, useContext, useMemo, useLayoutEffect} from 'react'
import {useMutation} from '@apollo/client'
import {datus} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {createSession, getSessions} from '../../../utils/storage'
import {changeTitle} from '../../../utils/notifications'
import Loading from '../../../shared/UI/Loading'
import {loginProfileM} from './gql'
import {ContextType} from '../../../env/types'

const Login: React.FC = () => {
    const {accountUpdate} = useContext<ContextType>(AppContext)

    const [sessions] = useState<any[]>(getSessions())
    const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false)

    const [state, setState] = useState({
        name: sessions.length !== 0 ? sessions[0].name : '',
        password: ''
    })

    const {name, password} = state

    useLayoutEffect(() => {
        changeTitle('Вход в Аккаунт')
    }, [])

    useMemo(() => {
        if (isLoginLoading) {
            setState({...state, name: '', password: ''})
        }
    }, [isLoginLoading])

    const [loginProfile] = useMutation(loginProfileM, {
        onCompleted(data) {
            if (data.loginProfile.name !== '') {
                accountUpdate(false, data.loginProfile, 2)
                createSession({name: data.loginProfile.name, dateUp: datus.now('date')})
            } else {
                setIsLoginLoading(false)
            }           
        }
    })

    const onLogin = () => {
        loginProfile({
            variables: {
                name, password, timestamp: datus.now()
            }
        })

        setIsLoginLoading(true)
    }

    return (
        <>
            {isLoginLoading ? 
                    <Loading label='Выполняется вход в учётную запись' />
                :
                    <>
                        <h2>Вход в Аккаунт</h2>

                        <input value={name} onChange={e => setState({...state, name: e.target.value})} placeholder='Ваше имя' type='text' />
                        <input value={password} onChange={e => setState({...state, password: e.target.value})} placeholder='Пароль' type='text' />                   

                        <button onClick={onLogin}>Войти</button>

                        <h2>Сессии на данном устройстве {sessions.length === 0 && 'отсутствуют'}</h2>

                        <div className='items half'>
                            {sessions.map(el => 
                                <div onClick={() => setState({...state, name: el.name})} className='item part'>
                                    {el.name}
                                    <p className='pale'>{el.dateUp}</p>
                                </div>
                            )}
                        </div>
                    </>
            }
        </>
    )
}

export default Login