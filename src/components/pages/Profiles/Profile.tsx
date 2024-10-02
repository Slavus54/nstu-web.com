import React, {useState, useContext, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import Photo from '../../../assets/photo/profile_photo.jpg'
import {AppContext} from '../../../context/AppContext'
import {codus} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import {onGetComponent} from '../../../utils/graphql'
import {onHandleKeyboardTrigger} from '../../../utils/features'
import ImageLook from '../../../shared/UI/ImageLook'
import DataPagination from '../../../shared/UI/DataPagination'
import CloseIt from '../../../shared/UI/CloseIt'
import LikeButton from '../../../shared/UI/LikeButton'
import Loading from '../../../shared/UI/Loading'
import MapPicker from '../../../shared/UI/MapPicker'
import {getProfileM, manageProfileProjectM} from './gql'
import {VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {Cords, MapType, ContextType} from '../../../env/types'

const Profile: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    
    const [projects, setProjects] = useState<any[]>([])
    const [project, setProject] = useState<any | null>(null)
    const [profile, setProfile] = useState<any | null>(null)

    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [likesCounter, setLikesCounter] = useState<number>(0)
    const [image, setImage] = useState<string>('')

    const [getProfile] = useMutation(getProfileM, {
        onCompleted(data) {
            setProfile(data.getProfile)
        }
    })

    const [manageProfileProject] = useMutation(manageProfileProjectM, {
        onCompleted() {
            onGetComponent(getProfile, id)
        }
    })

    useLayoutEffect(() => {
        changeTitle('Пользователь')
        
        if (account.shortid !== '') {
            onGetComponent(getProfile, id)
        }
    
    }, [account])

    useEffect(() => {
        if (profile !== null) {
            setImage(profile.image !== '' ? profile.image : Photo) 
            setCords(profile.cords)
        }
    }, [profile])

    useEffect(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    onHandleKeyboardTrigger(() => window.history.back(), 'Escape')

    const onLikeProject = () => {
        manageProfileProject({
            variables: {
                id: profile.shortid, option: 'like', title: '', category: '', progress: 0, image: '', likes: project.likes + account.shortid, collId: project.shortid
            }
        })
    }

    return (
        <>
            {profile !== null &&
                <>
                    <ImageLook src={image} className='photo' alt="фотография аккаунта" />
                    <h2>{profile.name}</h2>
                    
                    {project === null ?
                            <>
                                <DataPagination items={profile.projects} setItems={setProjects} label='Список проектов:' />
                                
                                <div className='items half'>
                                    {projects.map(el => 
                                        <div onClick={() => setProject(el)} className='item card'>
                                            {codus.short(el.title)}
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setProject(null)} />

                                {image !== '' && <ImageLook src={image} className='photo' />}

                                <h2>{project.title} ({project.progress}%)</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Тип: {project.category}</h4>
                                    <h4 className='pale'><b>{likesCounter}</b> лайков</h4>
                                </div>

                                <LikeButton onClick={onLikeProject} dependency={project} likes={project.likes} setCounter={setLikesCounter} />
                            </>
                    }

                    <ReactMapGL {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL> 
                </>
              
            }

            {profile === null && <Loading label='Загрузка страницы пользователя' />}
        </>
    )
}

export default Profile