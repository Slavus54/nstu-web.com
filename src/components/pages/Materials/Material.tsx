import React, {useState, useContext, useMemo, useLayoutEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {useAtom} from 'jotai'
import {AppContext} from '../../../context/AppContext'
import {codus, datus} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import {classHandler} from '../../../utils/css'
import {onGetComponent} from '../../../utils/graphql'
import {onDownloadFile, onHandleKeyboardTrigger} from '../../../utils/features'
import ImageLoader from '../../../shared/UI/ImageLoader'
import ImageLook from '../../../shared/UI/ImageLook'
import CloseIt from '../../../shared/UI/CloseIt'
import LikeButton from '../../../shared/UI/LikeButton'
import DataPagination from '../../../shared/UI/DataPagination'
import Loading from '../../../shared/UI/Loading'
import {imageContentAtom} from '../../../store/atoms'
import {getMaterialM, addMaterialResourceM, updateMaterialRatingM, manageMaterialConspectM} from './gql'
import {RESOURCE_TYPES, DEFAULT_RATING, CONSPECT_TYPES, SEMESTER_TYPES, RATING_STEP} from './env'
import {ContextType} from '../../../env/types'

const Material: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [resources, setResources] = useState<any[]>([])
    const [resource, setResource] = useState<any | null>(null)
    const [conspects, setConspects] = useState<any[]>([])
    const [conspect, setConspect] = useState<any | null>(null)
    const [material, setMaterial] = useState<any | null>(null)

    const [rating, setRating] = useState<number>(DEFAULT_RATING)
    const [likesCounter, setLikesCounter] = useState<number>(0)
    const [image, setImage] = useAtom(imageContentAtom)

    const [state, setState] = useState({
        title: '',
        format: RESOURCE_TYPES[0],
        url: '',
        dateUp: datus.now('date'),
        text: '',
        category: CONSPECT_TYPES[0],
        semester: SEMESTER_TYPES[0]
    })

    const {title, format, url, dateUp, text, category, semester} = state

    const [getMaterial] = useMutation(getMaterialM, {
        onCompleted(data) {
            setMaterial(data.getMaterial)
        }
    })

    const [addMaterialResource] = useMutation(addMaterialResourceM, {
        onCompleted() {
            onGetComponent(getMaterial, id)

            setState({...state, title: '', format: RESOURCE_TYPES[0], url: ''})
        }
    })

    const [updateMaterialRating] = useMutation(updateMaterialRatingM, {
        onCompleted() {
            onGetComponent(getMaterial, id)
        }
    })

    const [manageMaterialConspect] = useMutation(manageMaterialConspectM, {
        onCompleted() {
            onGetComponent(getMaterial, id)

            setState({...state, text: '', category: CONSPECT_TYPES[0], semester: SEMESTER_TYPES[0]})
        }
    })

    useLayoutEffect(() => {
        changeTitle('Учебный материал')
        
        if (account.shortid !== '') {
            onGetComponent(getMaterial, id)
        }
    
    }, [account])

    useMemo(() => {
        if (material !== null) {
            setRating(material.rating)
        }
    }, [material])

    onHandleKeyboardTrigger(() => window.history.back(), 'Escape')

    const onView = () => codus.go(resource.url)

    const onDownload = () => onDownloadFile(conspect.image, conspect.text)   

    const onAddResource = () => {
        addMaterialResource({
            variables: {
                name: account.name, id, title, format, url, dateUp
            }
        })
    }

    const onUpdateRating = () => {
        updateMaterialRating({
            variables: {
                name: account.name, id, rating
            }
        })
    }

    const onManageConspect = (option: string) => {
        manageMaterialConspect({
            variables: {
                name: account.name, id, option, text, category, semester, image, likes: option === 'create' ? '' : conspect.likes + account.shortid, collId: conspect !== null ? conspect.shortid : ''   
            }
        })
    }

    return (
        <>
            {material !== null &&
                <>
                    <h1>{material.title}</h1>
                    
                    <div className='items small'>
                        <h4 className='pale'>Направление: {material.category}</h4> 
                        <h4 className='pale'>Год: <b>{material.year}</b></h4> 
                    </div>

                    <h2>Оцените материал</h2>

                    <h4 className='pale'>Рейтинг: <b>{rating}%</b></h4>
                    <input value={rating} onChange={e => setRating(parseInt(e.target.value))} type='range' step={RATING_STEP} />

                    <button onClick={onUpdateRating}>Обновить</button>

                    {resource === null ?
                            <>
                                <h2>Новый Ресурс</h2>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название источника...' />
                            
                                <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                                    {RESOURCE_TYPES.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='URL' type='text' />

                                <button onClick={onAddResource}>Добавить</button>

                                <DataPagination items={material.resources} setItems={setResources} />

                                <div className='items half'>
                                    {resources.map(el => 
                                        <div onClick={() => setResource(el)} className='item card'>
                                            {codus.short(el.title)}
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <div className='main window'>
                                <CloseIt onClick={() => setResource(null)} />

                                <h2>{resource.title}</h2>

                                <div className='items little'>
                                    <h4 className='pale'>Тип: {resource.format}</h4>
                                    <h4 className='pale'>Опубликовано {resource.dateUp}</h4>
                                </div>

                                <button onClick={onView} className='light'>Подробнее</button>
                            </div>
                    }   

                    {conspect === null ?
                            <>
                                <h2>Новый Конспект</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Тема занятия...' />

                                <div className='items small'>
                                    {CONSPECT_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div>

                                <h4 className='pale'>Учебный семестр</h4>

                                <select value={semester} onChange={e => setState({...state, semester: e.target.value})}>
                                    {SEMESTER_TYPES.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <ImageLoader setImage={setImage} />
    
                                <button onClick={() => onManageConspect('create')}>Опубликовать</button>
                            
                                <DataPagination items={material.conspects} setItems={setConspects} label='Конспекты материала:' />

                                <div className='items half'>
                                    {conspects.map(el => 
                                        <div onClick={() => setConspect(el)} className='item panel'>
                                            {codus.short(el.text)}
                                            <small>{el.category}</small>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setConspect(null)} />

                                {conspect.image !== '' && <ImageLook onClick={onDownload} src={conspect.image} className='photo' />}

                                <h2>{conspect.text}</h2>

                                <div className='items little'>
                                    <h4 className='pale'>Тип: {conspect.category}</h4>
                                    <h4 className='pale'><b>{likesCounter}</b> лайков</h4>
                                </div>

                                {account.name === conspect.name ?
                                        <button onClick={() => onManageConspect('delete')}>Удалить</button>
                                    :
                                        <LikeButton onClick={() => onManageConspect('like')} dependency={conspect} likes={conspect.likes} setCounter={setLikesCounter}  />
                                }
                            </>
                    }   
                </>
            }

            {material === null && <Loading label='Загрузка страницы материала' />}
        </>
    )
}

export default Material