import React, {useState, useMemo, useLayoutEffect} from 'react'
import {useQuery} from '@apollo/client'
import {codus} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import {classHandler} from '../../../utils/css'
import RouterNavigator from '../../router/RouterNavigator'
import DataPagination from '../../../shared/UI/DataPagination'
import Loading from '../../../shared/UI/Loading'
import {getRoomsQ} from './gql'
import {DORMITORIES, FACULTIES, SEARCH_PERCENT} from '../../../env/env'

const Rooms: React.FC = () => {
    const [filtered, setFiltered] = useState<any[]>([])
    const [rooms, setRooms] = useState<any[] | null>(null)

    const [title, setTitle] = useState<string>('')
    const [dormitory, setDormitory] = useState<string>(DORMITORIES[0].title)
    const [faculty, setFaculty] = useState<string>(FACULTIES[0])

    const {data, loading} = useQuery(getRoomsQ)

    useLayoutEffect(() => {
        changeTitle('Комнаты')
        
        if (data) {
            setRooms(data.getRooms)
        }
    
    }, [data])

    useMemo(() => {
        if (rooms !== null) {
            let result: any[] = rooms.filter(el => el.dormitory === dormitory)

            if (title.length !== 0) {
                result = result.filter(el => codus.search(el.title, title, SEARCH_PERCENT))
            }
        
            result = result.filter(el => el.faculty === faculty)

            setFiltered(result)
        }
    }, [rooms, title, dormitory, faculty])

    return (
        <>
            <h1>Комнаты в общежитие</h1>
      
            <textarea value={title} onChange={e => setTitle(e.target.value)} placeholder='Название комнаты...' />

            <div className='items small'>
                {DORMITORIES.map(el => <div onClick={() => setDormitory(el.title)} className={classHandler(el.title, dormitory)}>{el.title}</div>)}
            </div>

            <h4 className='pale'>Выберите факультет</h4>

            <select value={faculty} onChange={e => setFaculty(e.target.value)}>
                {FACULTIES.map(el => <option value={el}>{el}</option>)}
            </select>

            <DataPagination items={filtered} setItems={setFiltered} />

            {data &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div className='item panel'>
                            <RouterNavigator url={`/room/${el.shortid}`}>
                                {codus.short(el.title)}
                                <small>№{el.num} | {el.faculty}</small>
                            </RouterNavigator>
                        </div>
                    )}
                </div>
            }

            {loading && <Loading label='Загрузка комнат' />}
        </>
    )
}

export default Rooms