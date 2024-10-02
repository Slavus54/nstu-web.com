import React, {useState, useContext, useMemo, useLayoutEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {codus, datus, maxMinutes} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {changeTitle} from '../../../utils/notifications'
import {updateProfileInfo} from '../../../utils/storage'
import {classHandler} from '../../../utils/css' 
import FormPagination from '../../../shared/UI/FormPagination'
import CounterView from '../../../shared/UI/CounterView'
import {createLectureM} from './gql'
import {DATES_LENGTH} from '../../../env/env'
import {LECTURE_TYPES, LECTURE_STATUSES, DURATIONS, TIME_STEP, STREAMS} from './env'
import {ContextType} from '../../../env/types'

const CreateLecture: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [dates] = useState<string[]>(datus.dates('day', DATES_LENGTH))
    const [timer, setTimer] = useState<number>(maxMinutes / 2)
    
    const [state, setState] = useState({
        title: '', 
        category: LECTURE_TYPES[0], 
        status: LECTURE_STATUSES[0], 
        duration: DURATIONS[0], 
        url: '', 
        time: '', 
        dateUp: dates[0], 
        stream: STREAMS[0], 
        card: ''
    })

    const {title, category, status, duration, url, time, dateUp, stream, card} = state

    useLayoutEffect(() => {
        changeTitle('Новая Лекция')
    }, [])

    const [createLecture] = useMutation(createLectureM, {
        onCompleted() {
            updateProfileInfo(null)
        }
    })

    useMemo(() => {
        let result: string = datus.time(timer)

        setState({...state, time: result})
    }, [timer])

    const onCreate = () => {
        createLecture({
            variables: {
                name: account.name, id, title, category, status, duration, url, time, dateUp, stream, card: codus.card(card)
            }
        })

        window.history.back()
    }

    return (
        <>
            <FormPagination items={[
                <>
                    <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Тема лекции...' />

                    <div className='items small'>
                        {LECTURE_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                    </div>

                    <h4 className='pale'>Статус & Длительность</h4>

                    <div className='items little'>
                        <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                            {LECTURE_STATUSES.map(el => <option value={el}>{el}</option>)}
                        </select>
                        <select value={duration} onChange={e => setState({...state, duration: e.target.value})}>
                            {DURATIONS.map(el => <option value={el}>{el}</option>)}
                        </select>
                    </div>

                    <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='Ссылка на ZOOM' type='text' />                    
                </>,
                <>
                    <h4 className='pale'>Дата и время</h4>

                    <div className='items small'>
                        {dates.map(el => <div onClick={() => setState({...state, dateUp: el})} className={classHandler(el, dateUp)}>{el}</div>)}
                    </div>

                    <CounterView num={timer} setNum={setTimer} part={TIME_STEP} min={maxMinutes / 3} max={maxMinutes}>
                        Начало в {time}
                    </CounterView>

                    <h4 className='pale'>Цель и реквизиты для пожертвования</h4>

                    <select value={stream} onChange={e => setState({...state, stream: e.target.value})}>
                        {STREAMS.map(el => <option value={el}>{el}</option>)}
                    </select>
                    
                    <input value={card} onChange={e => setState({...state, card: e.target.value})} placeholder='Номер карты' type='text' />    
                </>
            ]}>
                <h2>Новая Лекция</h2>
            </FormPagination>  
            
            <button onClick={onCreate}>Создать</button>
        </>
    )
}

export default CreateLecture