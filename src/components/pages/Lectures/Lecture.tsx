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
import {getLectureM, manageLectureQuestionM, updateLectureInformationM, manageLectureDetailM} from './gql'
import {LEVELS} from '../../../env/env'
import {STREAMS, DETAIL_TYPES, DEFAULT_RATING} from './env'
import {ContextType} from '../../../env/types'

const Lecture: React.FC = () => {
    const {id} = useParams() 
    const {account} = useContext<ContextType>(AppContext)

    const [questions, setQuestions] = useState<any[]>([])
    const [question, setQuestion] = useState<any | null>(null)
    const [details, setDetails] = useState<any[]>([])
    const [detail, setDetail] = useState<any | null>(null)
    const [lecture, setLecture] = useState<any | null>(null)

    const [isAuthor, setIsAuthor] = useState<boolean>(false)
    const [rating, setRating] = useState<number>(DEFAULT_RATING)
    const [image, setImage] = useAtom(imageContentAtom)

    const [state, setState] = useState({
        text: '',
        level: LEVELS[0],
        reply: '',
        dateUp: datus.now('date'),
        stream: STREAMS[0],
        card: '',
        title: '',
        category: DETAIL_TYPES[0]
    })

    const {text, level, reply, dateUp, stream, card, title, category} = state

    const [getLecture] = useMutation(getLectureM, {
        onCompleted(data) {
            setLecture(data.getLecture)
        }
    })

    const [manageLectureQuestion] = useMutation(manageLectureQuestionM, {
        onCompleted() {
            onGetComponent(getLecture, id)
        }
    })

    const [updateLectureInformation] = useMutation(updateLectureInformationM, {
        onCompleted() {
            onGetComponent(getLecture, id)
        }
    })

    const [manageLectureDetail] = useMutation(manageLectureDetailM, {
        onCompleted() {
            onGetComponent(getLecture, id)
        }
    })

    useLayoutEffect(() => {
        changeTitle('Публичная лекция')
        
        if (account.shortid !== '') {
            onGetComponent(getLecture, id)
        }
    
    }, [account])

    useMemo(() => {
        if (lecture !== null) {
            setIsAuthor(account.name === lecture.name)

            setState({...state, stream: lecture.stream, card: codus.card(lecture.card, false)})
        }
    }, [lecture])

    useMemo(() => {
        setState({...state, reply: ''})
    }, [question])

    useMemo(() => {
        setRating(detail !== null ? detail.rating : DEFAULT_RATING) 
    }, [detail])

    onHandleKeyboardTrigger(() => window.history.back(), 'Escape')

    const onView = () => codus.go(lecture.url)

    const onManageQuestion = (option: string) => {
        manageLectureQuestion({
            variables: {
                name: account.name, id, option, text, level, reply, dateUp, collId: question !== null ? question.shortid : ''
            }
        })
    }

    const onUpdateInformation = () => {
        updateLectureInformation({
            variables: {
                name: account.name, id, stream, card: codus.card(card)
            }
        })
    }

    const onManageDetail = (option: string) => {
        manageLectureDetail({
            variables: {
                name: account.name, id, option, title, category, image, rating, collId: detail !== null ? detail.shortid : ''
            }
        })
    }

    return (
        <>
            {lecture !== null &&
                <>
                    <h1>{lecture.title}</h1>

                    <h4 className='pale'>{lecture.dateUp} | {lecture.time}</h4>

                    <button onClick={onView} className='light'>Перейти</button>

                    {isAuthor ?
                            <>
                                <h2>Цель и реквизиты для пожертвования</h2>

                                <select value={stream} onChange={e => setState({...state, stream: e.target.value})}>
                                    {STREAMS.map(el => <option value={el}>{el}</option>)}
                                </select>
                                
                                <input value={card} onChange={e => setState({...state, card: e.target.value})} placeholder='Номер карты' type='text' />  

                                <button onClick={onUpdateInformation}>Обновить</button>  
                            </>
                        :
                            <>
                                <h2>Реквизиты для пожертвования</h2>

                                <h4 className='pale'>Номер карты: {lecture.card}</h4>

                                <h2>Новый Вопрос</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Формулировка вопроса...' />

                                <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                    {LEVELS.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <button onClick={() => onManageQuestion('create')}>Спросить</button>
                            </>
                    }

                    {question === null ?
                            <>
                                <DataPagination items={lecture.questions} setItems={setQuestions} label='Вопросы к лекции:' />
                                
                                <div className='items half'>
                                    {questions.map(el => 
                                        <div onClick={() => setQuestion(el)} className='item panel'>
                                            {codus.short(el.text)} <br />
                                            <small>{el.dateUp}</small>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setQuestion(null)} />

                                <h2>{question.text}?</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Уровень: {question.level}</h4>
                                    <h4 className='pale'>Опубликовано {question.dateUp}</h4>
                                </div>

                                {isAuthor ? 
                                        <>
                                            <textarea value={reply} onChange={e => setState({...state, reply: e.target.value})} placeholder='Ваш ответ...' />

                                            <button onClick={() => onManageQuestion('reply')}>Ответить</button>
                                        </>
                                    :
                                        <p>Ответ: {question.reply}</p>
                                }

                                {account.name === question.name && <button onClick={() => onManageQuestion('delete')}>Удалить</button>}
                            </>
                    }
                     
                    {detail === null ?
                            <>
                                <h2>Новая Деталь</h2>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название компонента...' />

                                <div className='items small'>
                                    {DETAIL_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div>   

                                <ImageLoader setImage={setImage} />
                            
                                <button onClick={() => onManageDetail('create')}>Добавить</button>

                                <DataPagination items={lecture.details} setItems={setDetails} label='Детали лекции:' />
                                
                                <div className='items half'>
                                    {details.map(el => 
                                        <div onClick={() => setDetail(el)} className='item card'>
                                            {codus.short(el.title)} <br />
                                            <small>{el.category}</small>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setDetail(null)} />

                                {detail.image !== '' && <ImageLook src={detail.image} className='photo' />}

                                <h2>{detail.title}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Тип: {detail.category}</h4>
                                    <h4 className='pale'>Рейтинг: {detail.rating}%</h4>
                                </div>

                                {account.name === detail.name ?
                                        <button onClick={() => onManageDetail('delete')}>Добавить</button>
                                    :
                                        <>
                                            <input value={rating} onChange={e => setRating(parseInt(e.target.value))} type='range' step={1} />
                                            
                                            <button onClick={() => onManageDetail('rate')}>Оценить</button>
                                        </>
                                }
                            </>
                    }
                </>
            }

            {lecture === null && <Loading label='Загрузка страницы лекции' />}
        </>
    )
}

export default Lecture