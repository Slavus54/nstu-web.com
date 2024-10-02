import React, {useState, useMemo, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useQuery} from '@apollo/client'
import {codus} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import {getTownsFromStorage} from '../../../utils/storage'
import RouterNavigator from '../../router/RouterNavigator'
import DataPagination from '../../../shared/UI/DataPagination'
import Loading from '../../../shared/UI/Loading'
import MapPicker from '../../../shared/UI/MapPicker'
import {getProfilesQ} from './gql'
import {PROFILE_STATUSES, SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {TownType, Cords, MapType} from '../../../env/types'

const Profiles: React.FC = () => {
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [filtered, setFiltered] = useState<any[]>([])
    const [profiles, setProfiles] = useState<any[] | null>(null)

    const [name, setName] = useState<string>('')
    const [status, setStatus] = useState<string>(PROFILE_STATUSES[0])
    const [region, setRegion] = useState<string>(towns[0].translation)
    const [cords, setCords] = useState<Cords>(towns[0].cords)

    const {data, loading} = useQuery(getProfilesQ)

    useLayoutEffect(() => {
        changeTitle('Пользователи')
        
        if (data) {
            setProfiles(data.getProfiles)
        }
    
    }, [data])

    useEffect(() => {
        if (region.length !== 0) {
            let result = towns.find(el => codus.search(el.translation, region, SEARCH_PERCENT))

            if (result !== undefined) {
                setRegion(result.translation)
                setCords(result.cords)
            }
        }
    }, [region])

    useEffect(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        if (profiles !== null) {
            let result: any[] = profiles.filter(el => el.region === region)

            if (name.length !== 0) {
                result = result.filter(el => codus.search(el.name, name, SEARCH_PERCENT))
            }
        
            result = result.filter(el => el.status === status)

            setFiltered(result)
        }
    }, [profiles, name, region, status])

    return (
        <>
            <h1>Пользователи</h1>
            
            <div className='items small'>
                <div className='item'>
                    <h4 className='pale'>Имя</h4>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder='Полное имя' type='text' />
                </div>

                <div className='item'>
                    <h4 className='pale'>Регион</h4>
                    <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Населённый пункт' type='text' />
                </div>
            </div>

            <select value={status} onChange={e => setStatus(e.target.value)}>
                {PROFILE_STATUSES.map(el => <option value={el}>{el}</option>)}
            </select>

            <DataPagination items={filtered} setItems={setFiltered} label='Пользователи на карте:' />

            {data &&
                <ReactMapGL onClick={e => setCords(codus.cords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker' />
                    </Marker>

                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <RouterNavigator url={`/profile/${el.shortid}`}>
                                {codus.short(el.name)}
                            </RouterNavigator>
                        </Marker>
                    )}
                </ReactMapGL> 
            }

            {loading && <Loading label='Загрузка пользователей' />}
        </>
    )
}

export default Profiles