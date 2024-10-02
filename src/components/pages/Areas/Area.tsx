import React, {useState, useContext, useMemo, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {useAtom} from 'jotai'
import {AppContext} from '../../../context/AppContext'
import {codus, datus} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import {classHandler} from '../../../utils/css' 
import {onGetComponent} from '../../../utils/graphql'
import {onDownloadFile, onHandleKeyboardTrigger} from '../../../utils/features'
import DataPagination from '../../../shared/UI/DataPagination'
import ImageLoader from '../../../shared/UI/ImageLoader'
import ImageLook from '../../../shared/UI/ImageLook'
import CloseIt from '../../../shared/UI/CloseIt'
import LikeButton from '../../../shared/UI/LikeButton'
import Loading from '../../../shared/UI/Loading'
import MapPicker from '../../../shared/UI/MapPicker'
import {imageContentAtom} from '../../../store/atoms' 
import {getAreaM, manageAreaLocationM, updateAreaFacultyM, offerAreaFactM} from './gql'
import {FACULTIES, LEVELS, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {LOCATION_TYPES, TERMS, STAGES} from './env'
import {ContextType, Cords, MapType} from '../../../env/types'

const Area: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [locations, setLocations] = useState<any[]>([])
    const [location, setLocation] = useState<any | null>(null)
    const [fact, setFact] = useState<any | null>(null)
    const [area, setArea] = useState<any | null>(null)

    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [likesCounter, setLikesCounter] = useState<number>(0)
    const [points, setPoints] = useState<number>(0)
    const [isSameCords, setIsSameCords] = useState<boolean>(false)
    const [isTruth, setIsTruth] = useState<boolean>(false)
    const [image, setImage] = useAtom(imageContentAtom)
    const [faculty, setFaculty] = useState<string>(FACULTIES[0])

    const [state, setState] = useState({
        title: '',
        category: LOCATION_TYPES[0],
        term: TERMS[0],
        stage: STAGES[0], 
        text: '',
        level: LEVELS[0],
        dateUp: datus.now('date')
    })

    const {title, category, term, stage, text, level, dateUp} = state

    const [getArea] = useMutation(getAreaM, {
        onCompleted(data) {
            setArea(data.getArea)
        }
    })

    const [manageAreaLocation] = useMutation(manageAreaLocationM, {
        onCompleted() {
            onGetComponent(getArea, id)
        }
    })

    const [updateAreaFaculty] = useMutation(updateAreaFacultyM, {
        onCompleted() {
            onGetComponent(getArea, id)
        }
    })

    const [offerAreaFact] = useMutation(offerAreaFactM, {
        onCompleted() {
            onGetComponent(getArea, id)

            setIsTruth(false)
            setState({...state, text: '', level: LEVELS[0]})
        }
    })

    useLayoutEffect(() => {
        changeTitle('Территория')
        
        if (account.shortid !== '') {
            onGetComponent(getArea, id)
        }
    
    }, [account])

    useEffect(() => {
        if (area !== null) {
            setCords(area.cords)
            setFaculty(area.faculty)
        }
    }, [area])

    useEffect(() => {
        if (area !== null) {
            setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
        
            setIsSameCords(area.cords.lat === cords.lat)
        }
    }, [cords])

    useMemo(() => {
        let flag: boolean = location !== null

        setImage(fact ? location.image : '')
        setState({...state, stage: flag ? location.stage : STAGES[0], term: flag ? location.term : TERMS[0]})
    }, [location])

    onHandleKeyboardTrigger(() => window.history.back(), 'Escape')

    const onDownloadPhoto = () => onDownloadFile(location.image, location.title)

    const onFact = () => {
        if (fact === null) {
            let result = codus.random(area.facts)

            if (result !== undefined) {
                setFact(result)
            }
        } else {
            if (isTruth === fact.isTruth) {
                let award: number = LEVELS.indexOf(fact.level) + 1

                setPoints(points + award)
            }

            setFact(null)
        }
    }

    const onManageLocation = (option: string) => {
        let flag: boolean = location !== null

        manageAreaLocation({
            variables: {
                name: account.name, id, option, title, category, term, cords, stage, image, likes: flag ? location.likes + account.shortid : '', collId: flag ? location.shortid : ''
            }
        })
    }

    const onUpdateFaculty = () => {
        updateAreaFaculty({
            variables: {
                name: account.name, id, faculty
            }
        })
    }

    const onOfferFact = () => {
        offerAreaFact({
            variables: {
                name: account.name, id, text, level, isTruth, dateUp
            }
        })
    }

    return (
        <>
            {area !== null &&
                <>
                    <h1>{area.title}</h1>

                    <h4 className='pale'>Тип: {area.category} | Основано в {area.century} веке</h4>

                    {location === null ? 
                            <>
                                <h2>Новое Место</h2>
                                <h4 className='pale'>Участок для реконструкции или строительства</h4>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Опишите это...' />

                                <div className='items small'>
                                    {LOCATION_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div>

                                <h4 className='pale'>Выберите время выполнения</h4>

                                <select value={term} onChange={e => setState({...state, term: e.target.value})}>
                                    {TERMS.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageLocation('create')}>Опубликовать</button>

                                <DataPagination items={area.locations} setItems={setLocations} label='Места на карте:' />
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setLocation(null)} />
                            
                                {image !== '' && <ImageLook onClick={onDownloadPhoto} src={image} className='photo' />}

                                <h2>{location.title}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Тип: {location.category}</h4>
                                    <h4 className='pale'><b>{likesCounter}</b> лайков</h4>
                                </div>

                                {account.name === location.name ?
                                        <>
                                            <select value={stage} onChange={e => setState({...state, stage: e.target.value})}>
                                                {STAGES.map(el => <option value={el}>{el}</option>)}
                                            </select>

                                            <ImageLoader setImage={setImage} />

                                            <div className='items little'>
                                                <button onClick={() => onManageLocation('delete')}>Удалить</button>
                                                <button onClick={() => onManageLocation('update')}>Обновить</button>
                                            </div>
                                        </>
                                    :
                                        <LikeButton onClick={() => onManageLocation('like')} dependency={location} likes={location.likes} setCounter={setLikesCounter} />
                                }
                            </>
                    }

                    <ReactMapGL onClick={e => setCords(codus.cords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        {!isSameCords &&
                            <Marker latitude={area.cords.lat} longitude={area.cords.long}>
                                <MapPicker type='home' />
                            </Marker>
                        }
                       
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>

                        {locations.map(el => 
                            <Marker onClick={() => setLocation(el)} latitude={el.cords.lat} longitude={el.cords.long}>
                                {codus.short(el.title)}
                            </Marker>
                        )}
                    </ReactMapGL> 

                    <h2>Курирующий факультет</h2>
                    
                    <select value={faculty} onChange={e => setFaculty(e.target.value)}>
                        {FACULTIES.map(el => <option value={el}>{el}</option>)}
                    </select>  

                    <button onClick={onUpdateFaculty}>Обновить</button>

                    {fact === null ? 
                            <>
                                <h2>Новый Факт</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Интересная информация...' />

                                <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                    {LEVELS.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <h4 className='pale'>Это правда?</h4>

                                <span onClick={() => setIsTruth(!isTruth)}>{isTruth ? 'Нет' : 'Да'}</span>

                                <button onClick={onOfferFact}>Предложить</button>

                                <h2>Правда или Ложь</h2>
                                
                                <h4 className='pale'>Набрано: <b>{points}</b> очков</h4>

                                <button onClick={onFact} className='light'>Факт</button>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setFact(null)} />

                                <h4 className='pale'>Это правда?</h4>

                                <span onClick={() => setIsTruth(!isTruth)}>{isTruth ? 'Нет' : 'Да'}</span>

                                <button onClick={onFact} className='light'>Проверить</button>
                            </>
                    }
                </>
            }

            {area === null && <Loading label='Загрузка страницы территории' />}
        </>
    )
}

export default Area