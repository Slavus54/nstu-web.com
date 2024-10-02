import React, {useState, useContext, useMemo, useLayoutEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {codus} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {changeTitle} from '../../../utils/notifications'
import {updateProfileInfo} from '../../../utils/storage'
import {classHandler} from '../../../utils/css' 
import FormPagination from '../../../shared/UI/FormPagination'
import {createIdeaM} from './gql'
import {IDEA_TYPES, IDEA_STAGES, ROLES_LIMIT, NEED_LIMIT, DEFAULT_RATING} from './env'
import {ContextType} from '../../../env/types'

const CreateIdea: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [role, setRole] = useState<string>('')
    const [percent, setPercent] = useState<number>(DEFAULT_RATING)
    
    const [state, setState] = useState({
        title: '', 
        concept: '',
        category: IDEA_TYPES[0], 
        url: '',
        roles: [], 
        stage: IDEA_STAGES[0],
        need: 0
    })

    const {title, concept, category, url, roles, stage, need} = state

    useLayoutEffect(() => {
        changeTitle('Новая Идея')
    }, [])

    const [createIdea] = useMutation(createIdeaM, {
        onCompleted() {
            updateProfileInfo(null)
        }
    })

    useMemo(() => {
        let result: number = codus.percent(percent, NEED_LIMIT, 0)

        setState({...state, need: result})
    }, [percent])

    const onAppendRole = () => {
        if (roles.length < ROLES_LIMIT) {
            setState({...state, roles: [...roles, role]})
        }

        setRole('')
    }

    const onCreate = () => {
        createIdea({
            variables: {
                name: account.name, id, title, category, concept, url, roles, stage, need
            }
        })

        window.history.back()
    }

    return (
        <>
            <FormPagination items={[
                <>
                    <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название идеи' type='text' />

                    <textarea value={concept} onChange={e => setState({...state, concept: e.target.value})} placeholder='Формулировка концепции...' />

                    <div className='items small'>
                        {IDEA_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                    </div>  

                    <h4 className='pale'>Связь</h4>

                    <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='URL' type='text' />

                    <h4 className='pale'>Список ролей ({roles.length}/{ROLES_LIMIT})</h4>
                
                    <input value={role} onChange={e => setRole(e.target.value)} placeholder='Роль в проекте' type='text' />
                
                    <button onClick={onAppendRole}>Добавить</button>

                    <h4 className='pale'>Необходимо <b>{need}</b> {codus.wordEnd(need, 'участник', 'а', 'ов')}</h4>
                    <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />
                </>
            ]}>
                <h2>Новая Идея</h2>
            </FormPagination>  
            
            <button onClick={onCreate}>Создать</button>
        </>
    )
}

export default CreateIdea