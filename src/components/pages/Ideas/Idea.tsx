import React, {useState, useContext, useMemo, useLayoutEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {useAtom} from 'jotai'
import {AppContext} from '../../../context/AppContext'
import {codus, datus} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import {classHandler} from '../../../utils/css'
import {onGetComponent} from '../../../utils/graphql'
import {onHandleKeyboardTrigger} from '../../../utils/features'
import DataPagination from '../../../shared/UI/DataPagination'
import ImageLoader from '../../../shared/UI/ImageLoader'
import ImageLook from '../../../shared/UI/ImageLook'
import CloseIt from '../../../shared/UI/CloseIt'
import Loading from '../../../shared/UI/Loading'
import {imageContentAtom} from '../../../store/atoms' 
import {getIdeaM, manageIdeaThoughtM, updateIdeaInformationM, publishIdeaQuoteM} from './gql'
import {FACULTIES} from '../../../env/env'
import {THOUGHT_TYPES, DEFAULT_RATING, IDEA_STAGES, STATUSES, NEED_LIMIT} from './env'
import {ContextType} from '../../../env/types'

const Idea: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [thoughts, setThoughts] = useState<any[]>([])
    const [thought, setThought] = useState<any | null>(null)
    const [quotes, setQuotes] = useState<any[]>([])
    const [quote, setQuote] = useState<any | null>(null)
    const [idea, setIdea] = useState<any | null>(null)

    const [percent, setPercent] = useState<number>(DEFAULT_RATING)
    const [need, setNeed] = useState<number>(0)
    const [image, setImage] = useAtom(imageContentAtom)

    const [state, setState] = useState({    
        title: '',
        category: THOUGHT_TYPES[0],
        rating: DEFAULT_RATING,
        stage: IDEA_STAGES[0],
        text: '',
        status: STATUSES[0],
        faculty: FACULTIES[0],
        dateUp: datus.now('date')
    })

    const {title, category, rating, stage, text, status, faculty, dateUp} = state

    const [getIdea] = useMutation(getIdeaM, {
        onCompleted(data) {
            setIdea(data.getIdea)
        }
    })

    const [manageIdeaThought] = useMutation(manageIdeaThoughtM, {
        onCompleted() {
            onGetComponent(getIdea, id)
        }
    })

    const [updateIdeaInformation] = useMutation(updateIdeaInformationM, {
        onCompleted() {
            onGetComponent(getIdea, id)
        }
    })

    const [publishIdeaQuote] = useMutation(publishIdeaQuoteM, {
        onCompleted() {
            onGetComponent(getIdea, id)
        }
    })

    useLayoutEffect(() => {
        changeTitle('Идея')
        
        if (account.shortid !== '') {
            onGetComponent(getIdea, id)
        }
    
    }, [account])

    useMemo(() => {
        if (idea !== null) {
            let result = codus.part(idea.need, NEED_LIMIT, 0)

            setState({...state, stage: idea.stage})
            setPercent(result)
        }
    }, [idea])

    useMemo(() => {
        let result: number = codus.percent(percent, NEED_LIMIT, 0)

        setNeed(result)
    }, [percent])

    useMemo(() => {
        setState({...state, rating: thought !== null ? thought.rating : DEFAULT_RATING})
    }, [thought])

    onHandleKeyboardTrigger(() => window.history.back(), 'Escape')

    const onManageThought = (option: string) => {
        manageIdeaThought({
            variables: {
                name: account.name, id, option, title, category, rating, image, collId: thought !== null ? thought.shortid : ''
            }
        })
    }

    const onUpdateInformation = () => {
        updateIdeaInformation({
            variables: {
                name: account.name, id, stage, need
            }
        })
    }

    const onPublishQuote = () => {
        publishIdeaQuote({
            variables: {
                name: account.name, id, text, status, faculty, dateUp
            }
        })
    }

    return (
        <>
            {idea !== null &&
                <>
                    <h1>{idea.title}</h1>

                    <h4 className='pale'>{idea.category}</h4>

                    <p>Концепция: {idea.concept}</p>

                    {thought === null ?
                            <>
                                <h2>Новое Предложение</h2>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Опишите это...' />
                            
                                <div className='items small'>
                                    {THOUGHT_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div>  

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageThought('create')}>Отправить</button>

                                <DataPagination items={idea.thoughts} setItems={setThoughts} label='Предложения:' />

                                <div className='items half'>
                                    {thoughts.map(el =>
                                        <div onClick={() => setThought(el)} className='item panel'>
                                            {codus.short(el.title)} <br />
                                            <small>{el.category}</small>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setThought(null)} />

                                {thought.image !== '' && <ImageLook src={thought.image} className='photo' />}

                                <h2>{thought.title}</h2>

                                <h4 className='pale'>Тип: {thought.category}</h4>
                             
                                {account.name === thought.name ?
                                        <button onClick={() => onManageThought('delete')}>Удалить</button>
                                    :
                                        <>
                                            <h4 className='pale'>Рейтинг: <b>{rating}%</b></h4>
                                            <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />
                                            
                                            <button onClick={() => onManageThought('rate')}>Оценить</button>
                                        </>
                                }
                            </>
                    }

                    <h2>Основная информация</h2>

                    {account.name === idea.name ?
                            <>
                                <select value={stage} onChange={e => setState({...state, stage: e.target.value})}>
                                    {IDEA_STAGES.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <h4 className='pale'>Необходимо <b>{need}</b> {codus.wordEnd(need, 'участник', 'а', 'ов')}</h4>
                                <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />
                            
                                <button onClick={onUpdateInformation}>Обновить</button>
                            </>
                        :
                            <div className='items small'>
                                <h4 className='pale'>Необходимо <b>{idea.need}</b> {codus.wordEnd(idea.need, 'участник', 'а', 'ов')}</h4>
                                <h4 className='pale'>Текущая стадия: {idea.stage}</h4>
                            </div>
                    }

                    {quote === null ?
                            <>
                                <h2>Новая Цитата</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Мнение об идее...' />

                                <div className='items small'>
                                    <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                                        {STATUSES.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                    <select value={faculty} onChange={e => setState({...state, faculty: e.target.value})}>
                                        {FACULTIES.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                </div>

                                <button onClick={onPublishQuote}>Опубликовать</button>

                                <DataPagination items={idea.quotes} setItems={setQuotes} label='Мнения об идее:' />
                                
                                <div className='items half'>
                                    {quotes.map(el => 
                                        <div onClick={() => setQuote(el)} className='item card'>
                                            {codus.short(el.text)}
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setQuote(null)} />

                                <h2>{quote.text}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Позиция: {quote.status}</h4>
                                    <h4 className='pale'>Факультет: {quote.faculty}</h4>
                                </div>
                            </>
                    }
                </>
            }

            {idea === null && <Loading label='Загрузка страницы идеи' />}
        </>
    )
}

export default Idea