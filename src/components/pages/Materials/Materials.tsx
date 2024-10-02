import React, {useState, useMemo, useLayoutEffect} from 'react'
import {useQuery} from '@apollo/client'
import {codus} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import {classHandler} from '../../../utils/css'
import RouterNavigator from '../../router/RouterNavigator'
import DataPagination from '../../../shared/UI/DataPagination'
import Loading from '../../../shared/UI/Loading'
import {getMaterialsQ} from './gql'
import {COURSES, SEARCH_PERCENT} from '../../../env/env'
import {MATERIAL_TYPES} from './env'

const Materials: React.FC = () => {
    const [filtered, setFiltered] = useState<any[]>([])
    const [materials, setMaterials] = useState<any[] | null>(null)

    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(MATERIAL_TYPES[0])
    const [course, setCourse] = useState<number>(COURSES[0])

    const {data, loading} = useQuery(getMaterialsQ)

    useLayoutEffect(() => {
        changeTitle('Учебные материалы')
        
        if (data) {
            setMaterials(data.getMaterials)
        }
    
    }, [data])

    useMemo(() => {
        if (materials !== null) {
            let result: any[] = materials.filter(el => el.category === category)

            if (title.length !== 0) {
                result = result.filter(el => codus.search(el.title, title, SEARCH_PERCENT))
            }
        
            result = result.filter(el => el.course === course)

            setFiltered(result)
        }
    }, [materials, title, category, course])

    return (
        <>
            <h1>Учебные материалы</h1>
      
            <textarea value={title} onChange={e => setTitle(e.target.value)} placeholder='Основная тема материала...' />

            <div className='items small'>
                {MATERIAL_TYPES.map(el => <div onClick={() => setCategory(el)} className={classHandler(el, category)}>{el}</div>)}
            </div>

            <h4 className='pale'>Курс обучения</h4>

            <select value={course} onChange={e => setCourse(parseInt(e.target.value))}>
                {COURSES.map(el => <option value={el}>{el}</option>)}
            </select>

            <DataPagination items={filtered} setItems={setFiltered} />

            {data &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div className='item panel'>
                            <RouterNavigator url={`/material/${el.shortid}`}>
                                {codus.short(el.title)}<br />
                                <small>{el.year}</small>
                            </RouterNavigator>
                        </div>
                    )}
                </div>
            }

            {loading && <Loading label='Загрузка материалов' />}
        </>
    )
}

export default Materials