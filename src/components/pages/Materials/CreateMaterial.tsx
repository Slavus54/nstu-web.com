import React, {useState, useContext, useLayoutEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {datus} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {changeTitle} from '../../../utils/notifications'
import {updateProfileInfo} from '../../../utils/storage'
import {classHandler} from '../../../utils/css' 
import FormPagination from '../../../shared/UI/FormPagination'
import {createMaterialM} from './gql'
import {COURSES} from '../../../env/env'
import {MATERIAL_TYPES, SUBJECT_LIMIT, DEFAULT_RATING} from './env'
import {ContextType} from '../../../env/types'

const CreateMaterial: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [subject, setSubject] = useState<string>('')
    
    const [state, setState] = useState({
        title: '', 
        category: MATERIAL_TYPES[0], 
        course: COURSES[0], 
        subjects: [], 
        year: datus.year()?.year, 
        rating: DEFAULT_RATING
    })

    const {title, category, course, subjects, year, rating} = state

    useLayoutEffect(() => {
        changeTitle('Новый Материал')
    }, [])

    const [createMaterial] = useMutation(createMaterialM, {
        onCompleted() {
            updateProfileInfo(null)
        }
    })

    const onSubject = () => {
        if (subjects.length < SUBJECT_LIMIT) {
            setState({...state, subjects: [...subjects, subject]})
        }

        setSubject('')
    }

    const onCreate = () => {
        createMaterial({
            variables: {
                name: account.name, id, title, category, course, subjects, year, rating
            }
        })

        window.history.back()
    }

    return (
        <>
            <FormPagination items={[
                <>
                    <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Основная тема материала...' />

                    <div className='items small'>
                        {MATERIAL_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                    </div>

                   

                    <h4 className='pale'>Список предметов {subjects.length}/{SUBJECT_LIMIT}</h4>
                
                    <input value={subject} onChange={e => setSubject(e.target.value)} placeholder='Название учебного предмета' type='text' />
                
                    <button onClick={onSubject}>Добавить</button>

                    <h4 className='pale'>Курс обучения</h4>

                    <select value={course} onChange={e => setState({...state, course: parseInt(e.target.value)})}>
                        {COURSES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <div className='items little'>
                        <h4 className='pale'>Рейтинг: <b>{rating}%</b></h4>
                        <h4 className='pale'>Год: <b>{year}</b></h4>
                    </div>
                    
                </>
            ]}>
                <h2>Новый Материал</h2>
            </FormPagination>  
            
            <button onClick={onCreate}>Создать</button>
        </>
    )
}

export default CreateMaterial