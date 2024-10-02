import React, {useState, useContext, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {codus} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {changeTitle} from '../../../utils/notifications'
import {updateProfileInfo, getTownsFromStorage} from '../../../utils/storage'
import {classHandler} from '../../../utils/css' 
import FormPagination from '../../../shared/UI/FormPagination'
import MapPicker from '../../../shared/UI/MapPicker'
import {createAreaM} from './gql'
import {FACULTIES, SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {AREA_TYPES, CENTURIES} from './env'
import {ContextType, MapType, TownType} from '../../../env/types'

const CreateArea: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())
    
    const [state, setState] = useState({
        title: '', 
        category: AREA_TYPES[0],
        century: CENTURIES[0], 
        region: towns[0].translation, 
        cords: towns[0].cords, 
        faculty: FACULTIES[0]
    })

    const {title, category, century, region, cords, faculty} = state

    useLayoutEffect(() => {
        changeTitle('Новая Территория')
    }, [])

    const [createArea] = useMutation(createAreaM, {
        onCompleted() {
            updateProfileInfo(null)
        }
    })

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

    const onCreate = () => {
        createArea({
            variables: {
                name: account.name, id, title, category, century, region, cords, faculty
            }
        })

        window.history.back()
    }

    return (
        <>
            <FormPagination items={[
                <>
                    <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название местности...' />

                    <div className='items small'>
                        {AREA_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                    </div>

                    <div className='items small'>
                        <select value={century} onChange={e => setState({...state, century: e.target.value})}>
                            {CENTURIES.map(el => <option value={el}>Основано в {el} веке</option>)}
                        </select>
                        <select value={faculty} onChange={e => setState({...state, faculty: e.target.value})}>
                            {FACULTIES.map(el => <option value={el}>Куратор - {el}</option>)}
                        </select>                  
                    </div>
                    
                    <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Регион' type='text' />

                    <ReactMapGL onClick={e => setState({...state, cords: codus.cords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL> 
                </>,
            ]}>
                <h2>Новая Территория</h2>
            </FormPagination>  
            
            <button onClick={onCreate}>Создать</button>
        </>
    )
}

export default CreateArea