import React, {useState, useMemo} from 'react'
import {useMutation} from '@apollo/client'
import {codus} from '../../../../shared/libs/libs'
import {updateProfileInfo} from '../../../../utils/storage'
import {buildNotification} from '../../../../utils/notifications'
import {classHandler} from '../../../../utils/css'
import ImageLoader from '../../../../shared/UI/ImageLoader'
import ImageLook from '../../../../shared/UI/ImageLook'
import DataPagination from '../../../../shared/UI/DataPagination'
import CloseIt from '../../../../shared/UI/CloseIt'
import {manageProfileProjectM} from '../gql'
import {ID_SIZE} from '../../../../env/env' 
import {PROJECT_TYPES, INITIAL_PROGRESS, PROGRESS_STEP} from '../env'
import {AccountPropsType} from '../../../../env/types'

const AccountProjectsPage: React.FC<AccountPropsType> = ({profile}) => {    
    const [projects, setProjects] = useState<any[]>([])
    const [project, setProject] = useState<any | null>(null)

    const [progress, setProgress] = useState<number>(INITIAL_PROGRESS)
    const [likesCounter, setLikesCounter] = useState<number>(0)
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        title: '', 
        category: PROJECT_TYPES[0], 
    })

    const {title, category} = state

    const [manageProfileProject] = useMutation(manageProfileProjectM, {
        onCompleted(data) {
            buildNotification(data.manageProfileAchievement)
            updateProfileInfo(null)

            setState({...state, title: '', category: PROJECT_TYPES[0]})
        }
    })

    useMemo(() => {
        let isProjectExist: boolean = project !== null

        setProgress(isProjectExist ? project.progress : INITIAL_PROGRESS)
        setImage(isProjectExist ? project.image : '')
        setLikesCounter(isProjectExist ? project.likes / ID_SIZE : 0)
    }, [project])

    const onManageProject = (option: string) => {
        manageProfileProject({
            variables: {
                id: profile.shortid, option, title, category, progress, image, likes: project.likes, collId: project !== null ? project.shortid : ''
            }
        })
    }

    return (
        <>
            {project === null ?
                    <>
                        <h2>Новый Проект</h2>

                        <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Опишите это...' />
                    
                        <div className='items small'>
                            {PROJECT_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                        </div>

                        <h4 className='pale'>Прогресс: <b>{progress}%</b></h4>
                        <input value={progress} onChange={e => setProgress(parseInt(e.target.value))} type='range' step={PROGRESS_STEP} />

                        <ImageLoader setImage={setImage} />

                        <button onClick={() => onManageProject('create')}>Добавить</button>

                        <DataPagination items={profile.projects} setItems={setProjects} label='Список проектов:' />

                        <div className='items half'>
                            {projects.map(el => 
                                <div onClick={() => setProject(el)} className='item panel'>
                                    {codus.short(el.title)}
                                    <p className='pale'>{el.category}</p>
                                </div>
                            )}
                        </div>
                    </>
                :
                    <>
                        <CloseIt onClick={() => setProject(null)} />

                        {image !== '' && <ImageLook src={image} className='photo' />}

                        <h2>{project.title}</h2>

                        <div className='items small'>
                            <h4 className='pale'>Тип: {project.category}</h4>
                            <h4 className='pale'><b>{likesCounter}</b> лайков</h4>
                        </div>
                      
                        <h4 className='pale'>Прогресс: <b>{progress}%</b></h4>
                        <input value={progress} onChange={e => setProgress(parseInt(e.target.value))} type='range' step={PROGRESS_STEP} />

                        <ImageLoader setImage={setImage} />

                        <div className='items little'>
                            <button onClick={() => onManageProject('delete')}>Удалить</button>
                            <button onClick={() => onManageProject('update')}>Обновить</button>
                        </div>
                    </>
            }
        </>
    )
}

export default AccountProjectsPage