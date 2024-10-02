import React, {useState, useContext, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {codus, datus} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {registerNotification, changeTitle} from '../../../utils/notifications'
import {createSession, getTownsFromStorage} from '../../../utils/storage'
import FormPagination from '../../../shared/UI/FormPagination'
import ImageLoader from '../../../shared/UI/ImageLoader'
import MapPicker from '../../../shared/UI/MapPicker'
import Loading from '../../../shared/UI/Loading'
import {registerProfileM} from './gql'
import {PROFILE_STATUSES, SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {ContextType, TownType, MapType} from '../../../env/types'


const Register: React.FC = () => {
    const {accountUpdate} = useContext<ContextType>(AppContext)
    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [towns] = useState<TownType[]>(getTownsFromStorage())
    const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false)
    const [image, setImage] = useState<string>('')
    
    const [state, setState] = useState({
        name: '',
        email: '',
        password: '', 
        region: towns[0].translation, 
        cords: towns[0].cords,
        status: PROFILE_STATUSES[0],
        points: 0
    })

    const {name, email, password, region, cords, status, points} = state

    useLayoutEffect(() => {
        changeTitle('Новый Аккаунт')
    }, [])

    useEffect(() => {
        if (region.length !== 0) {
            let result = towns.find(el => codus.search(el.translation, region, SEARCH_PERCENT))

            if (result !== undefined) {
                setState({...state, region: result.translation, cords: result.cords})
            }
        }
    }, [region])

    useEffect(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    const [registerProfile] = useMutation(registerProfileM, {
        onCompleted(data) {
            accountUpdate(false, data.registerProfile, 3)
            createSession({name: data.registerProfile.name, dateUp: datus.now('date')})
            registerNotification()

            setIsRegisterLoading(false)
        }
    })

    const onRegister = () => {
        registerProfile({
            variables: {
                name, email, password, region, cords, status, points, image, timestamp: datus.now()
            }
        })
        
        setIsRegisterLoading(true)
    }

    return (
        <>            
            {isRegisterLoading ? 
                    <Loading label='Учётная запись создаётся' /> 
                : 
                    <>
                        <FormPagination items={[
                            <>
                                <input value={name} onChange={e => setState({...state, name: e.target.value})} placeholder='Ваше имя' type='text' />

                                <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                                    {PROFILE_STATUSES.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <h4 className='pale'>Почта и Пароль</h4>
                                <input value={email} onChange={e => setState({...state, email: e.target.value})} placeholder='Почтовый адрес' type='text' />
                                <input value={password} onChange={e => setState({...state, password: e.target.value})} placeholder='Пароль' type='text' />  
                            </>,
                            <>
                                <h4 className='pale'>Город проживания</h4>
                                <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Регион' type='text' />
                                
                                <ReactMapGL onClick={e => setState({...state, cords: codus.cords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                                    <Marker latitude={cords.lat} longitude={cords.long}>
                                        <MapPicker type='picker' />
                                    </Marker>
                                </ReactMapGL> 
                            
                                <ImageLoader setImage={setImage} />  
                            </>
                        ]}>
                            <h2>Новый Аккаунт</h2>
                        </FormPagination>  
                        <button onClick={onRegister}>Создать</button>
                    </>
            }
        </>
    )
}

export default Register