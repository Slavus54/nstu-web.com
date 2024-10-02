import React, {useState, useMemo, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useQuery} from '@apollo/client'
import {codus} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import {getTownsFromStorage} from '../../../utils/storage'
import {classHandler} from '../../../utils/css' 
import RouterNavigator from '../../router/RouterNavigator'
import DataPagination from '../../../shared/UI/DataPagination'
import Loading from '../../../shared/UI/Loading'
import MapPicker from '../../../shared/UI/MapPicker'
import {getAreasQ} from './gql'
import {FACULTIES, SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {AREA_TYPES} from './env'
import {TownType, Cords, MapType} from '../../../env/types'

const Areas: React.FC = () => {
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [filtered, setFiltered] = useState<any[]>([])
    const [areas, setAreas] = useState<any[] | null>(null)

    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(AREA_TYPES[0])
    const [faculty, setFaculty] = useState<string>(FACULTIES[0])
    const [region, setRegion] = useState<string>(towns[0].translation)
    const [cords, setCords] = useState<Cords>(towns[0].cords)

    const {data, loading} = useQuery(getAreasQ)

    useLayoutEffect(() => {
        changeTitle('Территории')
        
        if (data) {
            setAreas(data.getAreas)
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
        if (areas !== null) {
            let result: any[] = areas.filter(el => el.category === category && el.region === region)

            if (title.length !== 0) {
                result = result.filter(el => codus.search(el.title, title, SEARCH_PERCENT))
            }
        
            result = result.filter(el => el.faculty === faculty)

            setFiltered(result)
        }
    }, [areas, title, category, faculty, region])

    return (
        <>
            <h1>Территории</h1>
            
            <div className='items small'>
                <div className='item'>
                    <h4 className='pale'>Название</h4>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Название' type='text' />
                </div>

                <div className='item'>
                    <h4 className='pale'>Регион</h4>
                    <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Населённый пункт' type='text' />
                </div>
            </div>

            <div className='items small'>
                {AREA_TYPES.map(el => <div onClick={() => setCategory(el)} className={classHandler(el, category)}>{el}</div>)}
            </div>

            <select value={faculty} onChange={e => setFaculty(e.target.value)}>
                {FACULTIES.map(el => <option value={el}>{el}</option>)}
            </select>

            <DataPagination items={filtered} setItems={setFiltered} label='Территории на карте:' />

            {data &&
                <ReactMapGL onClick={e => setCords(codus.cords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker' />
                    </Marker>

                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <RouterNavigator url={`/area/${el.shortid}`}>
                                {codus.short(el.title)}
                            </RouterNavigator>
                        </Marker>
                    )}
                </ReactMapGL> 
            }

            {loading && <Loading label='Загрузка территорий' />}
        </>
    )
}

export default Areas