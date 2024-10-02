import React, {useState, useContext, useMemo, useLayoutEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {datus, weekdays, maxMinutes} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {changeTitle} from '../../../utils/notifications'
import {updateProfileInfo} from '../../../utils/storage'
import {classHandler} from '../../../utils/css' 
import FormPagination from '../../../shared/UI/FormPagination'
import CounterView from '../../../shared/UI/CounterView'
import {createRoomM} from './gql'
import {FACULTIES, DORMITORIES} from '../../../env/env'
import {ROLES, DEFAULT_NUM, TIME_STEP, ROOM_MAX_NUM} from './env'
import {ContextType} from '../../../env/types'

const CreateRoom: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [timer, setTimer] = useState<number>(maxMinutes / 2)
    
    const [state, setState] = useState({
        title: '', 
        faculty: FACULTIES[0], 
        dormitory: DORMITORIES[0].title, 
        num: DEFAULT_NUM, 
        weekday: weekdays[0], 
        time: '', 
        cords: DORMITORIES[0].cords, 
        role: ROLES[0]
    })

    const {title, faculty, dormitory, num, weekday, time, cords, role} = state

    useLayoutEffect(() => {
        changeTitle('Новая Комната')
    }, [])

    const [createRoom] = useMutation(createRoomM, {
        onCompleted() {
            updateProfileInfo(null)
        }
    })

    useMemo(() => {
        let result: string = datus.time(timer)

        setState({...state, time: result})
    }, [timer])

    useMemo(() => {
        if (isNaN(num) || num < 1 || num > ROOM_MAX_NUM) {
            setState({...state, num: ROOM_MAX_NUM / 2})
        }
    }, [num])

    const onCreate = () => {
        createRoom({
            variables: {
                name: account.name, id, title, faculty, dormitory, num, weekday, time, cords, role
            }
        })
    
        window.history.back()
    }

    return (
        <>
            <FormPagination items={[
                <>
                    <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название комнаты...' />

                    <div className='items'>
                        {DORMITORIES.map(el => <div onClick={() => setState({...state, dormitory: el.title, cords: el.cords})} className={classHandler(el.title, dormitory)}>{el.title}</div>)}
                    </div>

                    <h4 className='pale'>Факультет | День уборки комнаты | Роль</h4>

                    <div className='items small'>
                        <select value={faculty} onChange={e => setState({...state, faculty: e.target.value})}>
                            {FACULTIES.map(el => <option value={el}>{el}</option>)}
                        </select>
                        <select value={weekday} onChange={e => setState({...state, weekday: e.target.value})}>
                            {weekdays.map(el => <option value={el}>{el}</option>)}
                        </select>
                        <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                            {ROLES.map(el => <option value={el}>{el}</option>)}
                        </select>
                    </div>
                    
                    <CounterView num={timer} setNum={setTimer} part={TIME_STEP} min={maxMinutes / 4} max={maxMinutes}>
                        Начало уборки: {time}
                    </CounterView>

                    <h4 className='pale'>Комната №{num}</h4>
                    <input value={num} onChange={e => setState({...state, num: parseInt(e.target.value)})} type='text' />
                </>
            ]}>
                <h2>Новая Комната</h2>
            </FormPagination>  
            
            <button onClick={onCreate}>Создать</button>
        </>
    )
}

export default CreateRoom