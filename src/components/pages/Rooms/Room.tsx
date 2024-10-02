import React, {useState, useContext, useTransition, useMemo, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {useAtom} from 'jotai'
import {AppContext} from '../../../context/AppContext'
import {codus, datus, weekdays, maxMinutes} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import {classHandler} from '../../../utils/css'
import {onGetComponent} from '../../../utils/graphql' 
import {onHandleKeyboardTrigger} from '../../../utils/features'
import RouterNavigator from '../../router/RouterNavigator'
import DataPagination from '../../../shared/UI/DataPagination'
import ImageLoader from '../../../shared/UI/ImageLoader'
import ImageLook from '../../../shared/UI/ImageLook'
import MapPicker from '../../../shared/UI/MapPicker'
import CounterView from '../../../shared/UI/CounterView'
import CloseIt from '../../../shared/UI/CloseIt'
import Loading from '../../../shared/UI/Loading'
import {imageContentAtom, placeTitleAtom, placeCategoryAtom, distanceAtom} from '../../../store/atoms'
import {getRoomM, manageRoomStatusM, updateRoomInformationM, manageRoomTaskM} from './gql'
import {DATES_LENGTH, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {ROLES, TIME_STEP, TASK_TYPES, PLACE_TYPES, PLACES} from './env'
import {ContextType, MapType, Cords} from '../../../env/types'

const Room: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [places, setPlaces] = useState<any[]>([])
    const [tasks, setTasks] = useState<any[]>([])
    const [task, setTask] = useState<any | null>(null)
    const [members, setMembers] = useState<any[]>([])
    const [member, setMember] = useState<any | null>(null)
    const [room, setRoom] = useState<any | null>(null)

    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [dates] = useState<string[]>(datus.dates('day', DATES_LENGTH))
    const [timer, setTimer] = useState<number>(0)
    const [role, setRole] = useState<string>(ROLES[0])
    const [time, setTime] = useState<string>('')
    const [image, setImage] = useAtom(imageContentAtom)
    const [isPending, startTransition] = useTransition()

    const [placeTitle, setPlaceTitle] = useAtom(placeTitleAtom)
    const [placeCategory, setPlaceCategory] = useAtom(placeCategoryAtom)
    const [distance, setDistance] = useAtom(distanceAtom)

    const [state, setState] = useState({
        weekday: weekdays[0],
        text: '',
        category: TASK_TYPES[0],
        deadline: dates[0]
    })

    const {weekday, text, category, deadline} = state

    const [getRoom] = useMutation(getRoomM, {
        onCompleted(data) {
            setRoom(data.getRoom)
        }
    })

    const [manageRoomStatus] = useMutation(manageRoomStatusM, {
        onCompleted() {
            onGetComponent(getRoom, id)
        }
    })

    const [updateRoomInformation] = useMutation(updateRoomInformationM, {
        onCompleted() {
            onGetComponent(getRoom, id)
        }
    })

    const [manageRoomTask] = useMutation(manageRoomTaskM, {
        onCompleted() {
            onGetComponent(getRoom, id)

            setState({...state, text: '', category: TASK_TYPES[0], deadline: dates[0]})
        }
    })

    useLayoutEffect(() => {
        changeTitle('Комната')
        
        if (account.shortid !== '') {
            onGetComponent(getRoom, id)
        }
        
        setPlaceCategory(PLACE_TYPES[0])

    }, [account])

    useMemo(() => {
        if (room !== null) {
            let user = room.members.find(el => el.shortid === account.shortid)
            let result: number = datus.time(room.time, 'deconvert')

            setTimer(result)
            setCords(room.cords)
            setState({...state, weekday: room.weekday})
        
            if (user !== undefined) {
                setMember(user)
            }
        }
    }, [room])

    useEffect(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        if (member !== null) {
            setRole(member.role)
        }
    }, [member])

    useMemo(() => {
        let result: string = datus.time(timer)

        setTime(result)
    }, [timer])

    useMemo(() => {
        setImage(task !== null ? task.image : '')
    }, [task])

    useEffect(() => {
        let filtered: any[] = PLACES.filter(el => el.category === placeCategory)

        setPlaces(filtered)
        setPlaceTitle('')
        setDistance(0)
    }, [placeCategory])

    onHandleKeyboardTrigger(() => window.history.back(), 'Escape')

    const onSetDistance = (title: string, placeCords: Cords) => {
        let result: number = codus.haversine(cords.lat, cords.long, placeCords.lat, placeCords.long)

        result = codus.round(result * 1e3, 1)

        setPlaceTitle(title)
        setDistance(result)
    }

    const onManageStatus = (option: string) => {
        manageRoomStatus({
            variables: {
                name: account.name, id, option, role
            }
        })
    }

    const onUpdateInformation = () => {
        updateRoomInformation({
            variables: {
                name: account.name, id, weekday, time
            }
        })
    }

    const onManageTask = (option: string) => {
        manageRoomTask({
            variables: {
                name: account.name, id, option, text, category, deadline, image, collId: task !== null ? task.shortid : ''
            }
        })
    }

    return (
        <>
            {room !== null &&
                <>
                    <h1>{room.title}</h1>

                    <h4 className='pale'>{room.dormitory} | №{room.num} | {room.faculty}</h4>

                    <h2>{places.length} мест для вашего досуга</h2>

                    <div className='items small'>
                        {PLACE_TYPES.map(el => <div onClick={() => startTransition(() => setPlaceCategory(el))} className={classHandler(el, placeCategory)}>{el}</div>)}
                    </div>

                    <h3>{placeTitle.length !== 0 ? placeTitle : 'Найдите место на карте'}</h3> 
                    {isPending ? <h4 className='pale'>Загрузка мест...</h4> : <h4 className='pale'>Дистанция до места: <b>{distance}м</b></h4>}

                    <ReactMapGL {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>

                        {places.map(el => 
                            <Marker onClick={() => onSetDistance(el.title, el.cords)} latitude={el.cords.lat} longitude={el.cords.long}>
                                {codus.short(el.title)}
                            </Marker>
                        )}
                    </ReactMapGL> 
                    
                    <h2>Моя роль</h2>

                    <select value={role} onChange={e => setRole(e.target.value)}>
                        {ROLES.map(el => <option value={el}>{el}</option>)}
                    </select>
                </>
            }

            {room !== null && member === null && <button onClick={() => onManageStatus('join')}>Присоединиться</button>}

            {room !== null && member !== null && 
                <>
                    <div className='items small'>
                        <button onClick={() => onManageStatus('exit')}>Выйти</button>
                        <button onClick={() => onManageStatus('update')}>Обновить</button>
                    </div>

                    {task === null ?
                            <>
                                <h2>Новая Задача</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Опишите это...' />

                                <div className='items small'>
                                    {TASK_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div>

                                <select value={deadline} onChange={e => setState({...state, deadline: e.target.value})}>
                                    {dates.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageTask('create')}>Опубликовать</button>

                                <DataPagination items={room.tasks} setItems={setTasks} label='Текущие задачи:' />

                                <div className='items half'>
                                    {tasks.map(el => 
                                        <div onClick={() => setTask(el)} className='item panel'>
                                            {codus.short(el.text)}
                                            <small>{el.deadline}</small>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <div className='main window'>
                                <CloseIt onClick={() => setTask(null)} />

                                {image !== '' && <ImageLook src={image} className='photo' />}

                                <h2>{task.text}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Тип: {task.category}</h4>
                                    <h4 className='pale'>Срок выполнения до {task.deadline}</h4>
                                </div>

                                {account.name === task.name ?
                                        <button onClick={() => onManageTask('delete')}>Удалить</button>
                                    :
                                        <>
                                            <ImageLoader setImage={setImage} />
                                            <button onClick={() => onManageTask('update')}>Обновить</button>
                                        </>
                                }
                            </div>
                    }

                    <h2>Информация об уборке</h2>

                    <select value={weekday} onChange={e => setState({...state, weekday: e.target.value})}>
                        {weekdays.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <CounterView num={timer} setNum={setTimer} part={TIME_STEP} min={maxMinutes / 4} max={maxMinutes}>
                        Начало уборки: {time}
                    </CounterView>

                    <button onClick={onUpdateInformation} className='light'>Обновить</button>

                    <DataPagination items={room.members} setItems={setMembers} label='Список жителей:' />
                
                    <div className='items half'>
                        {members.map(el => 
                            <div className='item card'>
                                <RouterNavigator url={`/profile/${el.shortid}`}>{el.name}</RouterNavigator>
                                <small>{el.role}</small>
                            </div>
                        )}
                    </div>
                </>
            }   

            {room === null && <Loading label='Загрузка страницы комнаты' />}
        </>
    )
}

export default Room