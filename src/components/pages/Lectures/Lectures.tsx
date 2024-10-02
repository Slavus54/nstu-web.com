import React, {useState, useMemo, useLayoutEffect} from 'react'
import {useQuery} from '@apollo/client'
import {codus} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import {classHandler} from '../../../utils/css'
import RouterNavigator from '../../router/RouterNavigator'
import DataPagination from '../../../shared/UI/DataPagination'
import Loading from '../../../shared/UI/Loading'
import {getLecturesQ} from './gql'
import {SEARCH_PERCENT} from '../../../env/env'
import {LECTURE_TYPES, LECTURE_STATUSES, DURATIONS} from './env'

const Lectures: React.FC = () => {
    const [filtered, setFiltered] = useState<any[]>([])
    const [lectures, setLectures] = useState<any[] | null>(null)

    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(LECTURE_TYPES[0])
    const [status, setStatus] = useState<string>(LECTURE_STATUSES[0])
    const [duration, setDuration] = useState<string>(DURATIONS[0])

    const {data, loading} = useQuery(getLecturesQ)

    useLayoutEffect(() => {
        changeTitle('Публичные лекции')
        
        if (data) {
            setLectures(data.getLectures)
        }
    
    }, [data])

    useMemo(() => {
        if (lectures !== null) {
            let result: any[] = lectures.filter(el => el.category === category && el.duration === duration)

            if (title.length !== 0) {
                result = result.filter(el => codus.search(el.title, title, SEARCH_PERCENT))
            }
        
            result = result.filter(el => el.status === status)

            setFiltered(result)
        }
    }, [lectures, title, category, status, duration])

    return (
        <>
            <h1>Публичные лекции</h1>
      
            <textarea value={title} onChange={e => setTitle(e.target.value)} placeholder='Тема лекции...' />

            <div className='items small'>
                {LECTURE_TYPES.map(el => <div onClick={() => setCategory(el)} className={classHandler(el, category)}>{el}</div>)}
            </div>

            <h4 className='pale'>Статус & Длительность</h4>

            <div className='items little'>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                    {LECTURE_STATUSES.map(el => <option value={el}>{el}</option>)}
                </select>
                <select value={duration} onChange={e => setDuration(e.target.value)}>
                    {DURATIONS.map(el => <option value={el}>{el}</option>)}
                </select>
            </div>

            <DataPagination items={filtered} setItems={setFiltered} />

            {data &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div className='item panel'>
                            <RouterNavigator url={`/lecture/${el.shortid}`}>
                                {codus.short(el.title)}<br />
                                <small>{el.dateUp} | {el.time}</small>
                            </RouterNavigator>
                        </div>
                    )}
                </div>
            }

            {loading && <Loading label='Загрузка лекций' />}
        </>
    )
}

export default Lectures