import React, {useState, useMemo, useLayoutEffect} from 'react'
import {useQuery} from '@apollo/client'
import {codus} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import {classHandler} from '../../../utils/css'
import RouterNavigator from '../../router/RouterNavigator'
import DataPagination from '../../../shared/UI/DataPagination'
import Loading from '../../../shared/UI/Loading'
import {getIdeasQ} from './gql'
import {SEARCH_PERCENT} from '../../../env/env'
import {IDEA_TYPES, IDEA_STAGES} from './env'

const Ideas: React.FC = () => {
    const [filtered, setFiltered] = useState<any[]>([])
    const [ideas, setIdeas] = useState<any[] | null>(null)

    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(IDEA_TYPES[0])
    const [stage, setStage] = useState<string>(IDEA_STAGES[0])

    const {data, loading} = useQuery(getIdeasQ)

    useLayoutEffect(() => {
        changeTitle('Идеи для проектов')
        
        if (data) {
            setIdeas(data.getIdeas)
        }
    
    }, [data])

    useMemo(() => {
        if (ideas !== null) {
            let result: any[] = ideas.filter(el => el.category === category)

            if (title.length !== 0) {
                result = result.filter(el => codus.search(el.title, title, SEARCH_PERCENT))
            }
        
            result = result.filter(el => el.stage === stage)

            setFiltered(result)
        }
    }, [ideas, title, category, stage])

    return (
        <>
            <h1>Идеи для проектов</h1>
      
            <textarea value={title} onChange={e => setTitle(e.target.value)} placeholder='Формулировка идеи...' />

            <div className='items small'>
                {IDEA_TYPES.map(el => <div onClick={() => setCategory(el)} className={classHandler(el, category)}>{el}</div>)}
            </div>

            <h4 className='pale'>Текущая стадия</h4>

            <select value={stage} onChange={e => setStage(e.target.value)}>
                {IDEA_STAGES.map(el => <option value={el}>{el}</option>)}
            </select>

            <DataPagination items={filtered} setItems={setFiltered} />

            {data &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div className='item panel'>
                            <RouterNavigator url={`/idea/${el.shortid}`}>
                                {codus.short(el.title)}<br />
                            </RouterNavigator>
                        </div>
                    )}
                </div>
            }

            {loading && <Loading label='Загрузка идей' />}
        </>
    )
}

export default Ideas